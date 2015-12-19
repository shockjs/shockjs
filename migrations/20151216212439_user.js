
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tbl_user', function (table) {
        table.increments();
        table.string('firstName').notNull();
        table.string('lastName').notNull();
        table.string('username').notNull();
        table.string('password').notNull();
        table.string('email').notNull();
        table.boolean('active').notNull().default(0);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tbl_user');
};
