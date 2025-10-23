package br.com.InovaTech.InovaTech.helpers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class ConfigurationApplication implements ApplicationRunner {

    @Autowired
    LoadProperties props;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        this.props = props;
    }
}
