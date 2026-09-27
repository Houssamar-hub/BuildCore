'use strict';

const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload un fichier sur Cloudinary
 * @param {string} filePath - Chemin local du fichier
 * @param {string} folder - Dossier Cloudinary
 * @param {object} options - Options supplémentaires
 * @returns {Promise<object>} Résultat Cloudinary
 */
const uploadToCloudinary = async (filePath, folder = 'imara360', options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
      ...options,
    });
    return result;
  } catch (error) {
    logger.error(`Erreur upload Cloudinary: ${error.message}`);
    throw error;
  }
};

/**
 * Supprimer un fichier de Cloudinary
 * @param {string} publicId - ID public Cloudinary
 * @returns {Promise<object>} Résultat suppression
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error(`Erreur suppression Cloudinary: ${error.message}`);
    throw error;
  }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
