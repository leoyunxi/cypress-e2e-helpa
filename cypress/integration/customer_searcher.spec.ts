/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />
// @ts-ignore
const users = require('../fixtures/user_data.json')

describe('3.捜索者情報一覧画面', () => {
    class PageObj {
        visit() {
            cy.visit('/customer_searcher.html');
        }

        get titleLeft() {
            return cy.get('.title_left');
        }

        get addBtn() {
            return cy.get('#add');
        }

        get changeBtn() {
            return cy.get('#change');
        }

        get deleteBtn() {
            return cy.get('#delete');
        }

        get groupBtn() {
            return cy.get('#group_btn');
        }

        get backBtn() {
            return cy.get('.backbutton');
        }

    }

    // ページオブジェクトインスタンス作成
    const p = new PageObj();

    // ページをリロードする
    beforeEach(() => {
        cy.fixture('display_constant.json').as('constant');
        cy.fixture('user_data.json').as('users');

        p.visit();
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/NisekoServer/customer_searcher.html');
        });
        cy.screenshot({capture: "runner", overwrite: true});
    });

    afterEach(() => {
        cy.screenshot({capture: "runner", overwrite: true});
    })

    after(function() {
        // テストデータをクリア
        cy.task("query", {
            sql: `
            DELETE FROM "searchAccount_ex" WHERE "userName" LIKE $1 ;
            `,
            values: ['cy-user%']
        }).then(res => {
            cy.reload()
            // @ts-ignore
            cy.log(`rows: ${res.rows.length}`)
        })
    })

    it('1-12', function () {
        // 設計書と同じ画面であること
        p.titleLeft.should('contain.text', this.constant.customerSearcherTitle);
        cy.contains('お名前');
        cy.contains('電話番号');
        cy.contains('所属');

        p.addBtn.should('exist');
        p.changeBtn.should('exist');
        p.deleteBtn.should('exist');
        p.groupBtn.should('exist');
    });

    it('1-13', function () {
        p.addBtn.click();

        // 捜索者情報登録画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher_new.html');
    });

    it('1-14',  function () {
        //テストユーザーを追加
        // cy.addSearcher(users.user114);
        cy.insertSearcher(users.user114);

        // ユーザーデータがあることを確認
        cy.get('tbody>tr')
            // calls the 'length' property yielding that value
            .its('length')
            .should('be.at.least', 1);

        // ユーザーをチェック
        cy.checkUser('cy-user114')

        //編集ボタンクリック
        p.changeBtn.click();

        // 捜索者情報変更画面に画面遷移すること
        cy.location('pathname').should('include', 'customer_searcher_editing.html');

    });

    it('1-15', function () {
        p.groupBtn.click();

        // グループ情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'group_list.html');
    });

    it('1-16', function () {
        p.backBtn.click();

        // 捜索者情報TOP画面に画面遷移すること
        cy.location('pathname').should('include', 'index_group.html');
    });

    it('1-17', function () {
        //テストユーザーを追加
        // cy.addSearcher(users.user117);
        cy.insertSearcher(users.user117);

        // ユーザーデータがあることを確認
        cy.get('tbody>tr')
            .its('length')
            .should('be.at.least', 1);

        // ユーザーをチェック
        cy.checkUser('cy-user117');
        p.deleteBtn.click();

        // 確認ポップアップ表示されること
        cy.on("window:confirm", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.deleteConfirmMsg);
        });
    });

    it('1-18', function () {

        //テストユーザーを追加
        // cy.addSearcher(users.user118);
        cy.insertSearcher(users.user118);

        // ユーザーデータがあることを確認
        cy.get('tbody>tr')
            .its('length')
            .should('be.at.least', 1);

        // ユーザーをチェック
        cy.checkUser('cy-user118')
        p.deleteBtn.click();

        // 確認ポップアップ表示されること
        cy.on("window:confirm", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.deleteConfirmMsg);
        });

        // OKの場合、選択ユーザーが削除されること
        cy.contains('cy-user118').should('not.exist');
    });

    it('1-19', function () {
        //テストユーザーを追加
        // cy.addSearcher(users.user119);
        cy.insertSearcher(users.user119);

        // ユーザーデータがあることを確認
        cy.get('tbody>tr')
            .its('length')
            .should('be.at.least', 1);

        // ユーザーをチェック
        cy.checkUser('cy-user119');

        // 削除ボタンをクリック
        p.deleteBtn.click();

        // 確認ポップアップ表示されること
        cy.on("window:confirm", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.deleteConfirmMsg);
            return false;
        });

        // キャンセルの場合、選択ユーザーがリストに存在すること
        cy.contains('cy-user119');
    });


});
