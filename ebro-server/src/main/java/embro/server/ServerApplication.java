package embro.server;

import embro.server.property.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import java.io.File;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@EnableConfigurationProperties({
        FileStorageProperties.class
})
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
//        setHadoopHomeEnvironmentVariable();
    }

//    private static void setHadoopHomeEnvironmentVariable() {
//        HashMap<String, String> hadoopEnvSetUp = new HashMap<>();
//        hadoopEnvSetUp.put("HADOOP_HOME", new File("winutils-master/hadoop-2.8.1").getAbsolutePath());
//        Class<?> processEnvironmentClass = null;
//        try {
//            processEnvironmentClass = Class.forName("java.lang.ProcessEnvironment");
//
//            Field theEnvironmentField = processEnvironmentClass.getDeclaredField("theEnvironment");
//            theEnvironmentField.setAccessible(true);
//            Map<String, String> env = (Map<String, String>) theEnvironmentField.get(null);
//            env.clear();
//            env.putAll(hadoopEnvSetUp);
//            Field theCaseInsensitiveEnvironmentField = processEnvironmentClass.getDeclaredField("theCaseInsensitiveEnvironment");
//            theCaseInsensitiveEnvironmentField.setAccessible(true);
//            Map<String, String> cienv = (Map<String, String>) theCaseInsensitiveEnvironmentField.get(null);
//            cienv.clear();
//            cienv.putAll(hadoopEnvSetUp);
//        } catch (NoSuchFieldException e) {
//            e.printStackTrace();
//        } catch (ClassNotFoundException e) {
//            e.printStackTrace();
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        }
//    }
}
