
exports.up = (knex, Promise) => {
    return knex.schema.createTable('tbl_user', function (table) {
        table.increments();
        table.string('firstName').notNull();
        table.string('lastName').notNull();
        table.string('username').notNull().unique();
        table.string('password').notNull();
        table.string('salt').notNull();
        table.string('email').notNull().unique();
        table.boolean('active').notNull().default(0);
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('tbl_user');
};
