package com.mohan.student_management;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentManagementApplication {

	private static final String JDBC_POSTGRES_PREFIX = "jdbc:postgresql://";

	public static void main(String[] args) {
		configureDatabaseUrlFromEnvironment();
		SpringApplication.run(StudentManagementApplication.class, args);
	}

	private static void configureDatabaseUrlFromEnvironment() {
		String springDatasourceUrl = System.getenv("SPRING_DATASOURCE_URL");
		String springDatasourceUsername = System.getenv("SPRING_DATASOURCE_USERNAME");
		String springDatasourcePassword = System.getenv("SPRING_DATASOURCE_PASSWORD");
		String databaseUrl = System.getenv("DATABASE_URL");
		String datasourceUrl = hasText(springDatasourceUrl) ? springDatasourceUrl : databaseUrl;

		if (!hasText(datasourceUrl)) {
			return;
		}

		DatabaseConnection databaseConnection = parseDatabaseUrl(datasourceUrl);
		System.setProperty("spring.datasource.url", databaseConnection.jdbcUrl());

		if (!hasText(springDatasourceUsername) && hasText(databaseConnection.username())) {
			System.setProperty("spring.datasource.username", databaseConnection.username());
		}

		if (!hasText(springDatasourcePassword) && databaseConnection.password() != null) {
			System.setProperty("spring.datasource.password", databaseConnection.password());
		}
	}

	private static DatabaseConnection parseDatabaseUrl(String databaseUrl) {
		String normalizedUrl = databaseUrl;
		if (normalizedUrl.startsWith(JDBC_POSTGRES_PREFIX)) {
			normalizedUrl = normalizedUrl.substring("jdbc:".length());
		}

		URI uri = URI.create(normalizedUrl);
		if (!"postgres".equals(uri.getScheme()) && !"postgresql".equals(uri.getScheme())) {
			throw new IllegalArgumentException("Unsupported DATABASE_URL scheme: " + uri.getScheme());
		}

		StringBuilder jdbcUrl = new StringBuilder(JDBC_POSTGRES_PREFIX).append(uri.getHost());
		if (uri.getPort() != -1) {
			jdbcUrl.append(':').append(uri.getPort());
		}
		jdbcUrl.append(hasText(uri.getRawPath()) ? uri.getRawPath() : "/");
		String rawQuery = toJdbcQuery(uri.getRawQuery());
		if (hasText(rawQuery)) {
			jdbcUrl.append('?').append(rawQuery);
		}

		String username = null;
		String password = null;
		if (hasText(uri.getRawUserInfo())) {
			String[] userInfo = uri.getRawUserInfo().split(":", 2);
			username = decode(userInfo[0]);
			password = userInfo.length > 1 ? decode(userInfo[1]) : "";
		}

		return new DatabaseConnection(jdbcUrl.toString(), username, password);
	}

	private static String toJdbcQuery(String rawQuery) {
		if (!hasText(rawQuery)) {
			return rawQuery;
		}

		String[] parameters = rawQuery.split("&", -1);
		for (int i = 0; i < parameters.length; i++) {
			if ("channel_binding".equals(parameterName(parameters[i]))) {
				parameters[i] = "channelBinding" + parameterValue(parameters[i]);
			}
		}
		return String.join("&", parameters);
	}

	private static String parameterName(String parameter) {
		int separatorIndex = parameter.indexOf('=');
		return separatorIndex == -1 ? parameter : parameter.substring(0, separatorIndex);
	}

	private static String parameterValue(String parameter) {
		int separatorIndex = parameter.indexOf('=');
		return separatorIndex == -1 ? "" : parameter.substring(separatorIndex);
	}

	private static String decode(String value) {
		return URLDecoder.decode(value, StandardCharsets.UTF_8);
	}

	private static boolean hasText(String value) {
		return value != null && !value.isBlank();
	}

	private record DatabaseConnection(String jdbcUrl, String username, String password) {
	}

}
