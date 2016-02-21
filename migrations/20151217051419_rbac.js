"use strict";

const AuthManager = require('../dist/server/classes/auth.manager.class').default;

exports.up = (knex, Promise) => {

  const type = knex.schema.createTable('tbl_authType', (table) => {
    table.increments();
    table.string('label').notNullable().unique();
    table.string('name').notNullable().unique();
    table.integer('type').notNullable();
    table.text('description');
    table.string('createdAt').notNullable();
    table.string('updatedAt').notNullable();
  }).catch(function(error) {
    console.error(error);
  });

  const typeChild = type.then(() => {
    return knex.schema.createTable('tbl_authTypeChild', (table) => {
      table.increments();
      table.integer('parent', 10)
        .unsigned()
        .references('id')
        .inTable('tbl_authType')
        .onDelete('cascade')
        .onUpdate('cascade')
        .notNullable();
      table.integer('child', 10)
        .unsigned()
        .references('id')
        .inTable('tbl_authType')
        .onDelete('cascade')
        .onUpdate('cascade')
        .notNullable();
      table.unique(['parent', 'child']);
    });
  }).catch((error) => {
    console.error(error);
  });

  const typeAssign = typeChild.then(() => {
    return knex.schema.createTable('tbl_authAssignment', (table) => {
      table.increments();
      table.integer('authTypeID', 10)
        .unsigned()
        .references('id')
        .inTable('tbl_authType')
        .notNullable()
        .onDelete('cascade')
        .onUpdate('cascade');
      table.integer('userID', 10)
        .unsigned()
        .references('id')
        .inTable('tbl_user')
        .notNullable()
        .onDelete('cascade')
        .onUpdate('cascade');

      table.unique(['authTypeID', 'userID']);
    });
  }).catch((error) => {
    console.error(error);
  });

  return typeAssign.then(() => {
    const auth = new AuthManager(knex);
    return auth.createRole('Administrator', 'admin', 'The super administration role')
      .catch((error) => {
        console.error(error);
      });
  }).catch((error) => {
    console.error(error);
  });

};

exports.down = (knex, Promise) => {
  const dropAssign = knex.schema.dropTable('tbl_authAssignment');
  const dropTypeChild = dropAssign.then(() => knex.schema.dropTable('tbl_authTypeChild'));
  return dropTypeChild.then(() => knex.schema.dropTable('tbl_authType'));
};
