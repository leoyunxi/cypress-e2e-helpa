/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />
// @ts-ignore
// const users = require('../fixtures/user_data.json')


describe('4.捜索者情報登録画面', () => {
    class PageObj {
        visit() {
            cy.visit('/customer_searcher_new.html');
        }

        get pageTitle() {
            return cy.get('#title');
        }

        get addBtn() {
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

        p.visit();
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/customer_searcher_new.html');
        });
    });

    afterEach(() => {
        cy.screenshot({capture: "runner", overwrite: true});
    })

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

    it('1-20', function () {
        // 設計書と同じ画面であること
        p.pageTitle.should('contain.text', this.constant.customerSearcherNewTitle);
        cy.contains('お名前');
        cy.contains('電話番号');
        cy.contains('所属');

        p.addBtn.should('exist');
        p.cancelBtn.should('exist');

        cy.get('input[name=name]')
            .should('exist')
            .and('not.be.disabled')
            .should('have.attr', 'maxlength', 255);
        cy.get('input[name=telephone]')
            .should('exist')
            .and('not.be.disabled')
            .should('have.attr', 'maxlength', 11);
        cy.get('input[name=belongs]')
            .should('exist')
            .and('not.be.disabled')
            .should('have.attr', 'maxlength', 255);
    });

    it('1-21', function () {
        let user = this.users.user121;
        cy.addSearcher(user)

        cy.get('tbody').children()
            .its('length')
            .then(lengthBefore => {
                p.visit();
                p.cancelBtn.click();

                // 捜索者情報一覧画面に画面遷移すること
                cy.location('pathname').should('include', 'customer_searcher.html');

                // 捜索者情報がキャンセル押下前、後で変化がないこと
                cy.get('tbody').children()
                    .its('length')
                    .should('eq', lengthBefore)
            });
    });

    it('1-22', function () {
        let user = this.users.user122;
        cy.addSearcher(user)

        // 捜索者情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher.html');

        // 登録したユーザが一覧に表示(追加)されていること
        cy.contains(user.phone).should('be.visible')
    });

    it('1-23', function () {
        let user = this.users.user123;
        cy.addSearcher(user)

        // 捜索者情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher.html');

        // 登録したユーザが一覧に表示(追加)されていること
        cy.contains(user.phone).should('be.visible')
    });

    it('1-24', function () {
        const stub = cy.stub()
        cy.on('window:alert', stub)

        let user = this.users.user124;

        cy.addSearcher(user)
            // アラートが表示されること
            .then(() => {

                debugger

                expect(stub.getCall(0)).to.be.calledWith('電話番号は半角数字で入力してください')
            });
    });

    it('1-25', function () {
        const stub = cy.stub()
        cy.on('window:alert', stub)

        let user = this.users.user125;

        cy.addSearcher(user)
            // アラートが表示されること
            .then(() => {
                expect(stub.getCall(0)).to.be.calledWith('電話番号は11文字で入力してください')
            });
    });

    it('1-26', function () {
        const stub = cy.stub()
        cy.on('window:alert', stub)

        let user = this.users.user126;

        cy.addSearcher(user)
            // アラートが表示されること
            .then(() => {
                expect(stub.getCall(0)).to.be.calledWith('電話番号を入力してください。')
            });
    });

    it('1-27', function () {
        let user = this.users.user127;
        cy.addSearcher(user)

        // 捜索者情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher.html');

        // 登録したユーザが一覧に表示(追加)されていること
        cy.contains(user.phone).should('be.visible')
    });


});