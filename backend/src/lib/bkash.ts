
import config from "../config/config";
import { redisClient } from "./redis";

export const bkashIdToken = async () => {
	const idtokenKey = "bkash:idtoken";
	const refreshTokenKey = "bkash:refreshToken";

	let bkashIdtokenFromRedis = await redisClient.get(idtokenKey);
	const bkashidTokenTTL = await redisClient.ttl(idtokenKey); //remaining time to live in seconds

	let bkashRefreshToken = await redisClient.get(refreshTokenKey);
	const bkashRefreshTokenTTL = await redisClient.ttl(refreshTokenKey);

	if (
		(bkashidTokenTTL <= 600 || !bkashIdtokenFromRedis) &&
		bkashRefreshToken &&
		bkashRefreshTokenTTL > 600
	) {
		const bkashRefreshResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/token/refresh`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					username: config.bkash_username,
					password: config.bkash_password,
				},
				body: JSON.stringify({
					app_key: config.bkash_app_key,
					app_secret: config.bkash_app_secret,
					refresh_token: bkashRefreshToken,
				}),
			},
		);

		if (!bkashRefreshResponse.ok) {
			throw new Error("refreshtoken api not work in bkash");
		}

		const result = await bkashRefreshResponse.json();

		await redisClient.set(idtokenKey, result.id_token, {
			expiration: {
				type: "EX",
				value: 60 * 60, // 1 hour
			},
		});

		return result.id_token;
	}

	if (bkashIdtokenFromRedis && bkashidTokenTTL > 600) {
		console.log("Bkash Id Token fetched from Redis:", bkashIdtokenFromRedis);
		return bkashIdtokenFromRedis;
	}

	const response = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/token/grant`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				username: config.bkash_username,
				password: config.bkash_password,
			},
			body: JSON.stringify({
				app_key: config.bkash_app_key,
				app_secret: config.bkash_app_secret,
			}),
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch Bkash ID token: ${response.status} ${response.statusText}`,
		);
	}

	const result = await response.json();

	await redisClient.set(idtokenKey, result.id_token, {
		expiration: {
			type: "EX",
			value: 60 * 60, // 1 hour
		},
	});

	await redisClient.set(refreshTokenKey, result.refresh_token, {
		expiration: {
			type: "EX",
			value: 60 * 60 * 24 * 28,
		},
	});

	return result.id_token;
};
