// services/responseFormatter.js

/**
 * Clean role data by removing nested personne to avoid duplication
 */
const cleanRoleData = (roleData) => {
  const cleaned = roleData.toJSON ? roleData.toJSON() : roleData;
  if (cleaned.Personne) {
    delete cleaned.Personne;
  }
  return cleaned;
};

/**
 * Format authentication response with personne and role(s)
 * @param {Object} personneObj - Personne instance
 * @param {Object|Array} rolesObj - Role object(s) or array
 * @param {string} token - JWT token
 * @returns {Object} Formatted response
 */
exports.formatAuthResponse = (personneObj, rolesObj, token) => {
  const personneData = personneObj.toJSON();
  delete personneData.motDePassePersonne;

  const response = {
    personne: personneData
  };

  if (Array.isArray(rolesObj)) {
    // Multiple roles
    rolesObj.forEach(role => {
      if (role) {
        const roleKey = Object.keys(role).find(key => key !== 'Personne');
        if (roleKey) {
          response[roleKey] = cleanRoleData(role);
        }
      }
    });
  } else if (rolesObj) {
    // Single role - add each role property separately
    Object.keys(rolesObj).forEach(roleKey => {
      if (roleKey !== 'Personne' && rolesObj[roleKey]) {
        response[roleKey] = cleanRoleData(rolesObj[roleKey]);
      }
    });
  }

  if (token) {
    response.token = token;
  }

  return response;
};

/**
 * Format get response with personne and role
 * @param {Object} personneObj - Personne instance
 * @param {Object} roleObj - Role instance
 * @param {string} roleName - Role key name (client, fournisseur, etc.)
 * @returns {Object} Formatted response
 */
exports.formatGetResponse = (personneObj, roleObj, roleName) => {
  const personneData = personneObj.toJSON();
  delete personneData.motDePassePersonne;

  const roleData = roleObj.toJSON();
  delete roleData.Personne;

  return {
    personne: personneData,
    [roleName]: roleData
  };
};

/**
 * Format produit response according to standard structure
 * Includes creator info (fournisseur only) if present
 * @param {Object} produitData - Produit instance with relations
 * @returns {Object} Formatted response
 */
exports.formatProduitResponse = (produitData) => {
  if (!produitData) return null;

  const jsonData = produitData.toJSON ? produitData.toJSON() : produitData;

  const response = {
    produit: {
      idProduit: jsonData.idProduit,
      nomProduit: jsonData.nomProduit,
      descriptionProduit: jsonData.descriptionProduit,
      prixFournisseurClientProduit: jsonData.prixFournisseurClientProduit,
      prixFournisseurEntrepriseProduit: jsonData.prixFournisseurEntrepriseProduit,
      prixFournisseurProduit: jsonData.prixFournisseurProduit,
      comissionClientProduit: jsonData.comissionClientProduit,
      comissionEntrepriseProduit: jsonData.comissionEntrepriseProduit,
      stockProduit: jsonData.stockProduit,
      stockFournisseurProduit: jsonData.stockFournisseurProduit,
      quantiteMinProduitEntreprise: jsonData.quantiteMinProduitEntreprise,
      quantiteMinProduitClient: jsonData.quantiteMinProduitClient,
      statutVerificationProduit: jsonData.statutVerificationProduit,
      statutProductionProduit: jsonData.statutProductionProduit,
      idCategorieProduit: jsonData.idCategorieProduit,
      idFournisseur: jsonData.idFournisseur,
      idGestionnaire: jsonData.idGestionnaire,
      createdAt: jsonData.createdAt,
      updatedAt: jsonData.updatedAt
    },
    categorie: jsonData.categorie ? {
      idCategorieProduit: jsonData.categorie.idCategorieProduit,
      nomCategorie: jsonData.categorie.nomCategorieProduit,
      descriptionCategorie: jsonData.categorie.descriptionCategorieProduit
    } : null,
    images: jsonData.images ? jsonData.images.map(img => ({
      idProduitImage: img.idProduitImage,
      blobImage: img.blobImage,
      estImagePrincipale: img.estImagePrincipale,
      texteAltImage: img.texteAltImage
    })) : [],
    caracteristiques: jsonData.caracteristiques ? jsonData.caracteristiques.map(carac => ({
      idCaracteristique: carac.idCaracteristique,
      nomCaracteristique: carac.nomCaracteristique,
      typeValeurCaracteristique: carac.typeValeurCaracteristique,
      uniteValeurCaracteristique: carac.uniteValeurCaracteristique,
      produitcaracteristiques: {
        valeurCaracteristique: carac.ProduitCaracteristiques ? carac.ProduitCaracteristiques.valeurCaracteristique : null
      }
    })) : []
  };

  // Add fournisseur info if product was created by a fournisseur
  if (jsonData.idFournisseur && jsonData.fournisseur && jsonData.personne) {
    response.personne = {
      idPersonne: jsonData.personne.idPersonne,
      nomPersonne: jsonData.personne.nom
    };
    response.fournisseur = {
      idFournisseur: jsonData.fournisseur.idFournisseur,
      noteClientFournisseur: jsonData.fournisseur.noteClientFournisseur
    };
  }

  return response;
};

/**
 * Format array of produits
 * @param {Array} produits - Array of Produit instances
 * @returns {Array} Array of formatted produits
 */
exports.formatProduitResponseArray = (produits) => {
  return produits.map(p => exports.formatProduitResponse(p));
};

module.exports = exports;
