/**
 * GET /categories endpoint handler
 */
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IsNull } from 'typeorm';
import { Category } from 'src/entities/Category.entity';

const schema = {
  querystring: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      page: {
        type: 'integer',
      },
    },
  },
};

/**
 * This is used to constrain the max nesting level of categories being returned
 * to prevent performance issues with deeply nested category levels
 *
 * If further child categories are required, client can make additional requests
 */
const MAX_DEPTH = 3;
const PAGE_SIZE = 10;

const handler = async (
  app: FastifyInstance,
  req: FastifyRequest<{ Querystring: { id: number; page: number } }>,
  res: FastifyReply,
) => {
  try {
    const parentCategoryId: number = req.query.id;
    const pageNumber: number = req.query.page || 0;

    const findOptions = {
      take: PAGE_SIZE,
      skip: pageNumber * PAGE_SIZE,
      relations: [] as string[],
    };

    let relationString = 'children';
    for (let i = 0; i < MAX_DEPTH; i++) {
      findOptions.relations.push(relationString);
      relationString = `${relationString}.children`;
    }

    const categories = parentCategoryId
      ? await Category.find({ where: { id: parentCategoryId }, ...findOptions })
      : await Category.find({ where: { parentId: IsNull() }, ...findOptions });

    if (!categories.length && parentCategoryId) {
      // requested category id is non-existent return 404
      res.status(404).send({ success: true });
      return;
    }

    res.send({ data: categories, success: true });
  } catch (err) {
    app.log.error({ message: 'Failed to get categories', err });
    res.status(500).send({ success: false });
  }
};

export const setup = (app: FastifyInstance) => {
  app.get('/categories', { schema }, handler.bind(null, app));
};
