// middlewares/validate.js
// requireNested accepts a spec object where keys are top-level body keys and values
// are either `true` (top-level required) or an array of required nested properties.
// Examples:
// { personne: ['nomPersonne','emailPersonne','motDePassePersonne'], client: ['adresseClient'] }
// { emailPersonne: true, motDePassePersonne: true }

module.exports.requireNested = (spec) => {
  return (req, res, next) => {
    const body = req.body || {};
    const missing = [];

    Object.keys(spec).forEach((key) => {
      const rule = spec[key];

      if (Array.isArray(rule)) {
        // nested required fields under body[key]
        const nested = body[key];
        if (!nested || typeof nested !== 'object') {
          missing.push(key);
        } else {
          rule.forEach((f) => {
            if (!Object.prototype.hasOwnProperty.call(nested, f) || nested[f] === undefined || nested[f] === null || nested[f] === '') {
              missing.push(`${key}.${f}`);
            }
          });
        }
      } else if (rule === true) {
        // top-level required
        if (!Object.prototype.hasOwnProperty.call(body, key) || body[key] === undefined || body[key] === null || body[key] === '') {
          missing.push(key);
        }
      }
    });

    if (missing.length) {
      return res.status(400).json({ error: 'Missing required fields', missing });
    }

    next();
  };
};
