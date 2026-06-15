package com.authservice.auth.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;

@Configuration
public class MetricsConfig {

    @Bean
    public MeterRegistryCustomizer<MeterRegistry> disableSystemMetrics() {
        return registry -> registry.config().commonTags("metrics", "disabled");
    }
}