/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/* initialize your database connection */
import {Pool} from "pg";

/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    const pool = new Pool(config.env.DB);

    on("task", {
        log(message) {
            console.log(message)
            return null
        },
        async query({sql, values}) {
            try {
                const res = await pool.query(sql, values)
                return res;
            } catch (e) {
                cy.log('query error', e)
            } 

        }
    });

}
