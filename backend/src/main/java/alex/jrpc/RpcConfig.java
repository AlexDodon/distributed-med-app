package alex.jrpc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.googlecode.jsonrpc4j.spring.AutoJsonRpcServiceImplExporter;

@Configuration
public class RpcConfig {
	@Bean
	public AutoJsonRpcServiceImplExporter autoJsonRpcServiceImplExporter() {
		return new AutoJsonRpcServiceImplExporter();
	}
}
