// services/responseFormatter.js

/**
 * Clean role data by removing nested personne to avoid duplication
 */
const cleanRoleData = (roleData) => {
  const cleaned = roleData.toJSON();
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

module.exports = exports;
