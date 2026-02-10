const prisma = require('../prisma');

/**
 * @param {string} model 
 * @param {string} idParam  
 */
const checkOwnerOrAdmin = (model, idParam) => {
  return async (req, res, next) => {
    try {

      if (req.user.role === 'admin') return next();

      const id = Number(req.params[idParam]);

      const record = await prisma[model].findUnique({
        where: { id },
        select: { userId: true }
      });

      if (!record) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (record.userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: 'Ownership check failed' });
    }
  };
};

module.exports = { checkOwnerOrAdmin };
