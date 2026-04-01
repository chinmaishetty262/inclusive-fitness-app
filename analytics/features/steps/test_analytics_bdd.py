import importlib
import os
from unittest.mock import MagicMock

import pytest
from pytest_bdd import given, scenarios, then, when


os.environ.setdefault('MONGO_URI', 'mongodb://localhost:27017/test')
os.environ.setdefault('MONGO_DB', 'mla_test')

analytics_app = importlib.import_module('app')
scenarios('../analytics.feature')


@pytest.fixture(autouse=True)
def restore_db():
    original_db = analytics_app.db
    yield
    analytics_app.db = original_db


@given('the analytics database returns aggregated totals', target_fixture='aggregated_stats_context')
def aggregated_stats_context():
    expected_stats = [
        {
            'username': 'alex',
            'exercises': [
                {
                    'exerciseType': 'Running',
                    'totalDuration': 40,
                    'totalDistance': 6.5,
                    'totalSteps': 7000,
                }
            ],
        }
    ]
    exercises = MagicMock()
    exercises.aggregate.return_value = expected_stats
    analytics_app.db = MagicMock(exercises=exercises)
    return {
        'client': analytics_app.app.test_client(),
        'expected_stats': expected_stats,
        'exercises': exercises,
    }


@given('the analytics database returns user totals for a selected user', target_fixture='user_stats_context')
def user_stats_context():
    expected_stats = [
        {
            'username': 'alex',
            'exercises': [
                {
                    'exerciseType': 'Cycling',
                    'totalDuration': 55,
                    'totalDistance': 18.0,
                    'totalSteps': 0,
                }
            ],
        }
    ]
    exercises = MagicMock()
    exercises.aggregate.return_value = expected_stats
    analytics_app.db = MagicMock(exercises=exercises)
    return {
        'client': analytics_app.app.test_client(),
        'expected_stats': expected_stats,
        'exercises': exercises,
    }


@given('the analytics database returns weekly totals for the selected range', target_fixture='weekly_stats_context')
def weekly_stats_context():
    expected_stats = [
        {
            'exerciseType': 'Running',
            'totalDuration': 75,
        }
    ]
    exercises = MagicMock()
    exercises.aggregate.return_value = expected_stats
    analytics_app.db = MagicMock(exercises=exercises)
    return {
        'client': analytics_app.app.test_client(),
        'expected_stats': expected_stats,
        'exercises': exercises,
    }


@given('an analytics client', target_fixture='analytics_client')
def analytics_client():
    return analytics_app.app.test_client()


@when('the client requests all statistics', target_fixture='all_stats_response')
def all_stats_response(aggregated_stats_context):
    return aggregated_stats_context['client'].get('/stats')


@when('the client requests statistics for that user', target_fixture='user_stats_response')
def user_stats_response(user_stats_context):
    return user_stats_context['client'].get('/stats/alex')


@when('the client requests weekly statistics for a valid date range', target_fixture='valid_weekly_response')
def valid_weekly_response(weekly_stats_context):
    return weekly_stats_context['client'].get('/stats/weekly/?user=alex&start=2026-03-01&end=2026-03-07')


@then('the analytics response includes those totals')
def analytics_response_includes_those_totals(all_stats_response, aggregated_stats_context):
    assert all_stats_response.status_code == 200
    assert all_stats_response.get_json() == {'stats': aggregated_stats_context['expected_stats']}
    pipeline = aggregated_stats_context['exercises'].aggregate.call_args.args[0]
    assert pipeline[0]['$group']['totalDistance']['$sum']['$ifNull'] == ['$distance', 0]
    assert pipeline[0]['$group']['totalSteps']['$sum']['$ifNull'] == ['$steps', 0]


@then('the analytics response only includes the selected user totals')
def analytics_response_only_includes_selected_user_totals(user_stats_response, user_stats_context):
    assert user_stats_response.status_code == 200
    assert user_stats_response.get_json() == {'stats': user_stats_context['expected_stats']}
    pipeline = user_stats_context['exercises'].aggregate.call_args.args[0]
    assert pipeline[0] == {'$match': {'username': 'alex'}}


@then('the analytics response includes the weekly totals')
def analytics_response_includes_weekly_totals(valid_weekly_response, weekly_stats_context):
    assert valid_weekly_response.status_code == 200
    assert valid_weekly_response.get_json() == {'stats': weekly_stats_context['expected_stats']}
    pipeline = weekly_stats_context['exercises'].aggregate.call_args.args[0]
    assert pipeline[0]['$match']['username'] == 'alex'
    assert pipeline[1]['$group']['totalDuration'] == {'$sum': '$duration'}


@when('the client requests weekly statistics with an invalid start date', target_fixture='invalid_weekly_response')
def invalid_weekly_response(analytics_client):
    return analytics_client.get('/stats/weekly/?user=alex&start=bad-date&end=2026-03-07')


@then('the analytics response reports an invalid date format')
def analytics_response_reports_invalid_date(invalid_weekly_response):
    assert invalid_weekly_response.status_code == 400
    assert invalid_weekly_response.get_json() == {'error': 'Invalid date format'}
