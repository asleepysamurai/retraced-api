/**
 * Test test to test if the test tests
 * Delete this in forks
 */

import type { FastifyInstance } from 'fastify';
import { getManager } from 'typeorm';
import { initApp } from 'src/app';
import { Category } from 'src/entities/Category.entity';

const saveCategory = async (data: any) => {
  const manager = getManager();
  const category = manager.create(Category, data);
  await category.save();

  category.children = await Promise.all(
    (data.children || []).map((child: any) => {
      return saveCategory(child);
    }),
  );

  return await category.save();
};

describe('GET /categories endpoint', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await initApp();

    // Populate Categories

    await Promise.all(
      [
        {
          id: 1,
          name: 'category1',
          children: [
            {
              id: 11,
              name: 'category11',
              children: [
                {
                  id: 111,
                  name: 'category111',
                  children: [
                    {
                      id: 1111,
                      name: 'category1111',
                      children: [
                        {
                          id: 11111,
                          name: 'category11111',
                        },
                        {
                          id: 11112,
                          name: 'category11112',
                        },
                        {
                          id: 11113,
                          name: 'category11113',
                        },
                      ],
                    },
                    {
                      id: 1112,
                      name: 'category1112',
                    },
                    {
                      id: 1113,
                      name: 'category1113',
                    },
                  ],
                },
                {
                  id: 112,
                  name: 'category112',
                },
                {
                  id: 113,
                  name: 'category113',
                },
              ],
            },
            {
              id: 12,
              name: 'category12',
            },
            {
              id: 13,
              name: 'category13',
            },
          ],
        },
        {
          id: 2,
          name: 'category2',
        },
        {
          id: 3,
          name: 'category3',
        },
        {
          id: 4,
          name: 'category4',
        },
        {
          id: 5,
          name: 'category5',
        },
        {
          id: 6,
          name: 'category6',
        },
        {
          id: 7,
          name: 'category7',
        },
        {
          id: 8,
          name: 'category8',
        },
        {
          id: 9,
          name: 'category9',
        },
        {
          id: 10,
          name: 'category10',
        },
      ].map(saveCategory),
    );
  });

  test('Without id parameter: should return categories without parents as root categories', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/categories',
    });

    expect(
      JSON.parse(response.body).data.filter((category: Category) => {
        return category.parentId !== null;
      }).length,
    ).toEqual(0);
  });

  test('With existing id parameter: should return only 1 root category', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/categories?id=1',
    });

    expect(JSON.parse(response.body).data.length).toEqual(1);
  });

  test('With non-existing id parameter: should return 0 root category', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/categories?id=500',
    });

    expect(JSON.parse(response.body).data.length).toEqual(0);
  });

  test('Maximum page size should be 10', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/categories',
    });

    expect(JSON.parse(response.body).data.length).toBeLessThanOrEqual(10);
  });

  test('Pagination should provide differing result sets', async () => {
    const response1 = await app.inject({
      method: 'GET',
      url: '/v1/categories?page=0',
    });
    const response2 = await app.inject({
      method: 'GET',
      url: '/v1/categories?page=1',
    });

    const response1Ids = JSON.parse(response1.body).data.map((c: Category) => {
      return c.id;
    });
    const response2Ids = JSON.parse(response2.body).data.map((c: Category) => {
      return c.id;
    });

    const commonIds = response1Ids.filter((id: number) => {
      return response2Ids.includes(id);
    });
    expect(commonIds.length).toEqual(0);
  });

  test('Maximum categories nesting depth should be 3', async () => {
    const response1 = await app.inject({
      method: 'GET',
      url: '/v1/categories?id=1',
    });
    const response2 = await app.inject({
      method: 'GET',
      url: '/v1/categories?id=11',
    });

    // category11111 is in depth 4 and should not be in response1 but should be in response2
    expect(response1.body.includes('category11111')).toBe(false);
    expect(response2.body.includes('category11111')).toBe(true);
  });

  test('Should return non-root categories as parent if requested', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/categories?id=11',
    });

    expect(JSON.parse(response.body).data[0].name).toEqual('category11');
  });

  test('Should throw 400 if invalid id (non-numeric) provided', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/categories?id=abc',
    });

    expect(response.statusCode).toEqual(400);
  });
});
