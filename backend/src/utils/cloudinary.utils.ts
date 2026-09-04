import { UploadApiResponse } from "cloudinary";
import cloudinary from "../lib/cloudinary";

export const uploadImage = async (
	buffer: Buffer,
): Promise<{
	imageUrl: string;
	publicId: string;
}> => {
	const result = await new Promise<UploadApiResponse>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: "image",
				},
				(error, result) => {
					if (error) {
						return reject(error);
					}

					if (!result) {
						return reject(new Error("No result from Cloudinary"));
					}

					resolve(result);
				},
			)
			.end(buffer);
	});

	return {
		imageUrl: result.secure_url,
		publicId: result.public_id,
	};
};

export const deleteImage = async (publicId: string): Promise<void> => {
	await cloudinary.uploader.destroy(publicId);
};


export const uploadPdf = async (
	buffer: Buffer,
): Promise<{
	fileUrl: string;
	publicId: string;
}> => {
	const result = await new Promise<UploadApiResponse>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: "raw",
					format: "pdf",
				},
				(error, result) => {
					if (error) {
						return reject(error);
					}

					if (!result) {
						return reject(new Error("No result from Cloudinary"));
					}

					resolve(result);
				},
			)
			.end(buffer);
	});

	return {
		fileUrl: result.secure_url,
		publicId: result.public_id,
	};
};

export const deleteFile = async (publicId: string): Promise<void> => {
	await cloudinary.uploader.destroy(publicId, {
		resource_type: "raw",
	});
};