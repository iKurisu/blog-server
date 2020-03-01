"use strict";

const createComment = async (author, content, slug) => {
  return await strapi.query("comment").create({ author, content, slug });
};

const createWithNewAuthor = async (author, content, slug) => {
  try {
    const createdAuthor = await strapi.query("custom-user").create(author);
    return await createComment(createdAuthor, content, slug);
  } catch (e) {
    return e;
  }
};

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { author, content, slug } = ctx.request.body;

    const queriedAuthors = await strapi.query("custom-user").find(author);
    const authorExists = queriedAuthors.length > 0;

    return authorExists
      ? await createComment(queriedAuthors[0], content, slug)
      : await createWithNewAuthor(author, content, slug);
  }
};
