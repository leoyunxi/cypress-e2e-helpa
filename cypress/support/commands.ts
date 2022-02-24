// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

interface Searcher {
    name: string,
    phone: string,
    belong: string
}


interface Group {
    name: string,
    members: number[],
    id: number
}

Cypress.Commands.add('addSearcher', (user: Searcher) => {
    cy.visit('/customer_searcher_new.html');
    // cy.get('.form-group').within(function (){
    const {belong, phone, name} = user;

    if (name) cy.get('.form-group input[name=name]').type(name)
    if (phone) cy.get('.form-group input[name=telephone]').type(phone)
    if (belong) cy.get('.form-group input[name=belongs]').type(belong)

    cy.screenshot({capture: "runner", overwrite: true});
    cy.get('.btn-success').click();
    // });

    cy.on('window:alert', () => {
        cy.visit('/customer_searcher.html');
        cy.reload();
        // cy.go('back');
    });
});

Cypress.Commands.add('checkUser', (name: string) => {
    // ユーザーをチェック
    cy.contains(name)
        .parent()
        .find('input[type=checkbox]')
        .check()
    cy.screenshot({capture: "runner", overwrite: true});
});

Cypress.Commands.add('checkNotGroupUser', (phone: string) => {
    // 非groupユーザーをチェック
    cy.get('table.notGroup').within(() => {
        cy.contains(phone)
            .parent()
            .find('input[type=checkbox]')
            .check()
        cy.screenshot({capture: "runner", overwrite: true});
    })
});

Cypress.Commands.add('checkGroupUser', (phone: string) => {
    // groupユーザーをチェック
    cy.get('table.group').within(() => {
        cy.contains(phone)
            .parent()
            .find('input[type=checkbox]')
            .check()
        cy.screenshot({capture: "runner", overwrite: true});
    })
});

Cypress.Commands.add('editUser', (phone: string) => {
    cy.visit('/customer_searcher.html');
    // ユーザーを編集
    cy.contains(phone)
        .parent()
        .find('input[type=checkbox]')
        .check()

    cy.screenshot({capture: "runner", overwrite: true});
    cy.get('#change').click();
});

Cypress.Commands.add('deleteUser', (phone: string) => {
    cy.contains(phone)
        .parent()
        .find('input[type=checkbox]')
        .check()
    cy.get('#delete').click();

    cy.on("window:confirm", () => true);
    cy.contains('phone').should('not.exist');
});


Cypress.Commands.add('checkGroup', (name: string) => {
    // グループをチェック
    cy.contains(name)
        .parent()
        .find('input[type=checkbox]')
        .check()
    cy.screenshot({capture: "runner", overwrite: true});
});

Cypress.Commands.add('addGroupUser', (user: Searcher,group:Group) => {
    //一覧画面へ
    cy.visit('/group_list.html');

    //グループを選択
    cy.checkGroup(group.name);
    cy.get('#change').click();

    //ユーザーをグループに登録
    cy.checkNotGroupUser(user.phone);

    //追加ボタンクリック
    cy.get('#insert').click();

    //登録を押す
    cy.get('#regist').click();
});


Cypress.Commands.add('cleanup', () => {
    cy.get('tbody').children()
        .find('input[type="checkbox"]')
        .check();
    cy.get('#delete').click();

    cy.on("window:confirm", () => {
        true
    });
    cy.contains('cy-user').should('not.exist');
});


Cypress.Commands.add('insertSearcher', (searcher: Searcher) => {
    cy.task("query", {
        sql: `
                SELECT MAX(id) FROM "searchAccount_ex";
                `,
        values: []
    }).then(res => {
        cy.task("query", {
            sql: `
                INSERT INTO "searchAccount_ex"(id, "telephoneNo", "userName", belongs) VALUES ($1, $2, $3, $4);
                `,
            // @ts-ignore
            values: [res.rows[0].max + 1, searcher.phone, searcher.name, searcher.belong]
        }).then(res => {
            cy.reload();
            // @ts-ignore
            cy.log(`rows: ${res.rows.length}`)
        })
    })
});

Cypress.Commands.add('insertSearchGroup', (group: Group) => {
    cy.task("query", {
        sql: `
                SELECT MAX(id) FROM "searchGroup_ex";
                `,
        values: []
    }).then(res => {
        cy.task("query", {
            sql: `
                INSERT INTO  "searchGroup_ex"(id, "group",members) VALUES ($1, $2, $3);
                `,
            // @ts-ignore
            values: [res.rows[0].max + 1, group.name, group.members]
        }).then(res => {
            cy.reload();
            // @ts-ignore
            cy.log(`rows: ${res.rows.length}`)
        })
    })
});
