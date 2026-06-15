import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Onboarding from './Onboarding';

// Wrap with MemoryRouter because Onboarding uses useNavigate
const renderOnboarding = (onComplete = jest.fn()) => {
    return render(
        <MemoryRouter>
            <Onboarding onComplete={onComplete} />
        </MemoryRouter>
    );
};

describe('Onboarding', () => {

    beforeEach(() => {
        localStorage.clear();
        // Mock Notification API
        global.Notification = {
            permission: 'granted',
            requestPermission: jest.fn().mockResolvedValue('granted'),
        };
    });

    // Test 1 — renders first step
    it('renders the goal selection screen on load', () => {
        renderOnboarding();
        expect(screen.getByText("What's your fitness goal?")).toBeInTheDocument();
        expect(screen.getByText('🔥 Lose Weight')).toBeInTheDocument();
        expect(screen.getByText('💪 Build Muscle')).toBeInTheDocument();
        expect(screen.getByText('🏃 Improve Stamina')).toBeInTheDocument();
        expect(screen.getByText('🧘 Stay Active')).toBeInTheDocument();
    });

    // Test 2 — Next button disabled until goal selected
    it('disables Next button until a goal is selected', () => {
        renderOnboarding();
        const nextBtn = screen.getByText('Next →');
        expect(nextBtn).toBeDisabled();

        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        expect(nextBtn).not.toBeDisabled();
    });

    // Test 3 — clicking goal highlights it
    it('marks selected goal with onboarding-selected class', () => {
        renderOnboarding();
        const goalBtn = screen.getByText('💪 Build Muscle');
        fireEvent.click(goalBtn);
        expect(goalBtn).toHaveClass('onboarding-selected');
    });

    // Test 4 — Next button moves to step 2
    it('moves to activity level screen after clicking Next', () => {
        renderOnboarding();
        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        fireEvent.click(screen.getByText('Next →'));
        expect(screen.getByText('How active are you right now?')).toBeInTheDocument();
    });

    // Test 5 — Back button returns to step 1
    it('goes back to goal screen when Back is clicked on step 2', () => {
        renderOnboarding();
        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('← Back'));
        expect(screen.getByText("What's your fitness goal?")).toBeInTheDocument();
    });

    // Test 6 — Next on step 2 moves to step 3
    it('moves to reminders screen after selecting level and clicking Next', () => {
        renderOnboarding();
        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText("🌱 Beginner — I'm just getting started"));
        fireEvent.click(screen.getByText('Next →'));
        expect(screen.getByText('Stay on track 🔔')).toBeInTheDocument();
    });

    // Test 7 — reminder time input shows when checkbox ticked
    it('shows reminder time input when reminders checkbox is checked', () => {
        renderOnboarding();
        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText("🌱 Beginner — I'm just getting started"));
        fireEvent.click(screen.getByText('Next →'));

        expect(screen.queryByLabelText('Set daily reminder time')).not.toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Enable motivation reminders'));
        expect(screen.getByLabelText('Set daily reminder time')).toBeInTheDocument();
    });

    // Test 8 — saves to localStorage on finish
    it('saves profile to localStorage when Finish is clicked', () => {
        renderOnboarding();

        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText("🌱 Beginner — I'm just getting started"));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('Finish 🎉'));

        const saved = JSON.parse(localStorage.getItem('userProfile'));
        expect(saved).not.toBeNull();
        expect(saved.goal).toBe('🔥 Lose Weight');
        expect(saved.level).toBe('Beginner');
    });

    // Test 9 — shows completion screen after finish
    it('shows success screen after finishing onboarding', () => {
        renderOnboarding();

        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText("🌱 Beginner — I'm just getting started"));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('Finish 🎉'));

        expect(screen.getByText("🎉 You're all set!")).toBeInTheDocument();
        expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Go to Goals page →')).toBeInTheDocument();
    });

    // Test 10 — skip calls onComplete
    it('calls onComplete when Skip is clicked', () => {
        const onComplete = jest.fn();
        renderOnboarding(onComplete);
        fireEvent.click(screen.getByText('Skip'));
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    // Test 11 — Go to Dashboard calls onComplete
    it('calls onComplete when Go to Dashboard is clicked on done screen', () => {
        const onComplete = jest.fn();
        renderOnboarding(onComplete);

        fireEvent.click(screen.getByText('🔥 Lose Weight'));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText("🌱 Beginner — I'm just getting started"));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('Finish 🎉'));
        fireEvent.click(screen.getByText('Go to Dashboard'));

        expect(onComplete).toHaveBeenCalled();
    });

});