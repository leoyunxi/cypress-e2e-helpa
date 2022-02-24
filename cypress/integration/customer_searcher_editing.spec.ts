/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />
// @ts-ignore

describe('5.捜索者情報変更画面', () => {
    class PageObj {
        visit() {
            cy.visit('/customer_searcher_editing.html');
        }

        get pageTitle() {
            return cy.get('#title');
        }

        get submitBtn() {
            return cy.get('.btn-success');
        }

        get cancelBtn() {
            return cy.get('.btn-primary');
        }

    }

    // ページオブジェクトインスタンス作成
    const p = new PageObj();

    beforeEach(() => {
        cy.fixture('display_constant.json').as('constant');
        cy.fixture('user_data.json').as('users');
    });

    afterEach(() => {
        cy.screenshot({capture: "runner", overwrite: true});
    });

    after(function() {
        // テストデータをクリア
        cy.task("query", {
            sql: `
            DELETE FROM "searchAccount_ex" WHERE "telephoneNo" LIKE $1 ;
            `,
            values: ['001000001%']
        }).then(res => {
            cy.reload()
            // @ts-ignore
            cy.log(`rows: ${res.rows.length}`)
        })
    })

    it('1-28', function () {
        let commonUser = this.users.commonUser;
        cy.insertSearcher(commonUser);
        cy.editUser(commonUser.phone);

        // 設計書と同じ画面であること
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/customer_searcher_editing.html');
        });
        p.pageTitle.should('contain.text', this.constant.customerSearcherEditTitle);
        cy.contains('お名前');
        cy.contains('電話番号');
        cy.contains('所属');

        p.submitBtn.should('exist');
        p.cancelBtn.should('exist');

        cy.get('input[name=name]')
            .should('exist')
            .and('not.be.disabled')
            .should('have.attr', 'maxlength', 255);
        cy.get('input[name=telephone]')
            .should('exist')
            .and('have.attr', 'readonly', 'readonly')
            .should('have.attr', 'maxlength', 11);
        cy.get('input[name=belongs]')
            .should('exist')
            .and('not.be.disabled')
            .should('have.attr', 'maxlength', 255);
    });

    it('1-29', function () {

        let commonUser = this.users.commonUser;
        cy.insertSearcher(commonUser);
        cy.editUser(commonUser.phone);
        p.cancelBtn.click();

        // 捜索者情報一覧画面に画面遷移すること
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/customer_searcher.html');
        });

        // 捜索者情報がキャンセル押下前、後で変化がないこと
        cy.contains(commonUser.phone)
            .parent()
            .children()
            .then(($lis) => {
                expect($lis.eq(1), 'first item').to.contain(commonUser.name)
                expect($lis.eq(2), 'second item').to.contain(commonUser.phone)
                expect($lis.eq(3), 'third item').to.contain(commonUser.belong)
            })
    });


    it('1-30', function () {
        let user = this.users.user130;
        cy.insertSearcher(user);
        cy.editUser(user.phone);

        // お名前を変更
        cy.get('.form-group input[name=name]').clear().type(`userName delta`);
        p.submitBtn.click();

        // 捜索者情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher.html');

        // 捜索者情報が登録押下後変更した名前であること
        cy.contains(user.phone)
            .prev()
            .should('have.text', `userName delta`);
    });

    it('1-31', function () {
        let user = this.users.user131;
        cy.insertSearcher(user);
        cy.editUser(user.phone);

        // お名前を255文字変更
        cy.get('.form-group input[name=name]').clear().type(user?.nameDelta);
        p.submitBtn.click();

        // 捜索者情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher.html');

        // 捜索者情報が登録押下後変更した名前であること
        cy.contains(user.phone)
            .prev()
            .should('have.text', 'ABCDEFGHIJKLMNOPQRSTUVWXYZABC…');
    });


    it('1-32', function () {

        let commonUser = this.users.commonUser;
        cy.editUser(commonUser.phone);

        // 電話番号が変更できないこと
        cy.get('input[name=telephone]')
            .should('have.attr', 'readonly', 'readonly');
    });


    it('1-33', function () {
        let user = this.users.user133;
        cy.insertSearcher(user);
        cy.editUser(user.phone);

        // 所属を255文字変更
        cy.get('.form-group input[name=belongs]').clear().type(user?.belongDelta);
        p.submitBtn.click();

        // 捜索者情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher.html');

        // 捜索者情報が登録押下後変更した所属であること
        cy.contains(user.phone)
            .next()
            .should('have.text', 'ABCDEFGHIJKLMNOPQRSTUVWXYZABC…');
    });



});