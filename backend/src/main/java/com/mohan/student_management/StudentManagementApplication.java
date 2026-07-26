package com.mohan.student_management;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentManagementApplication {

	public static void main(String[] args) {
		configureDatabaseUrlFromEnvironment();
		SpringApplication.run(StudentManagementApplication.class, args);
	}

	private static void configureDatabaseUrlFromEnvironment() {
		String springDatasourceUrl = System.getenv("SPRING_DATASOURCE_URL");
		String springDatasourceUsername = System.getenv("SPRING_DATASOURCE_USERNAME");
		String springDatasourcePassword = System.getenv("SPRING_DATASOURCE_PASSWORD");
		String databaseUrl = System.getenv("DATABASE_URL");

		if (hasText(springDatasourceUrl) || !hasText(databaseUrl)) {
			return;
		}

		DatabaseConnection databaseConnection = parseDatabaseUrl(databaseUrl);
		System.setProperty("spring.datasource.url", databaseConnection.jdbcUrl());

		if (!hasText(springDatasourceUsername) && hasText(databaseConnection.username())) {
			System.setProperty("spring.datasource.username", databaseConnection.username());
		}

		if (!hasText(springDatasourcePassword) && databaseConnection.password() != null) {
			System.setProperty("spring.datasource.password", databaseConnection.password());
		}
	}

	private static DatabaseConnection parseDatabaseUrl(String databaseUrl) {
		if (databaseUrl.startsWith("jdbc:postgresql://")) {
			return new DatabaseConnection(databaseUrl, null, null);
		}

		URI uri = URI.create(databaseUrl);
		if (!"postgres".equals(uri.getScheme()) && !"postgresql".equals(uri.getScheme())) {
			throw new IllegalArgumentException("Unsupported DATABASE_URL scheme: " + uri.getScheme());
		}

		StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://").append(uri.getHost());
		if (uri.getPort() != -1) {
			jdbcUrl.append(':').append(uri.getPort());
		}
		jdbcUrl.append(hasText(uri.getRawPath()) ? uri.getRawPath() : "/");
		if (hasText(uri.getRawQuery())) {
			jdbcUrl.append('?').append(uri.getRawQuery());
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

	private static String decode(String value) {
		return URLDecoder.decode(value, StandardCharsets.UTF_8);
	}

	private static boolean hasText(String value) {
		return value != null && !value.isBlank();
	}

	private record DatabaseConnection(String jdbcUrl, String username, String password) {
	}

}
