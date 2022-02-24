/// <reference path="../support/index.d.ts" />
/// <reference types="cypress" />
// @ts-ignore
const groups = require('../fixtures/group_data.json')

describe('6.グループ情報一覧画面', () => {
    class PageObj {
        visit() {
            cy.visit('/group_list.html');
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

        get searchBtn() {
            return cy.get('#emergency_btn');
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
            expect(location.pathname).to.eq('/NisekoServer/group_list.html');
        });
        cy.screenshot({capture: "runner", overwrite: true});
    });

    afterEach(() => {
        cy.screenshot({capture: "runner", overwrite: true});
    })

    after(function () {
        // テストデータをクリア
        cy.task("query", {
            sql: `
            DELETE FROM "searchGroup_ex" WHERE "group" LIKE $1 ;
            `,
            values: ['cy-group%']
        }).then(res => {
            cy.reload()
            // @ts-ignore
            cy.log(`rows: ${res.rows.length}`)
        });

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
    });

    it('1-34', function () {
        // 設計書と同じ画面であること
        p.titleLeft.should('contain.text', this.constant.groupListTitle);
        cy.contains('グループ名');
        cy.contains('グループ人数');

        p.addBtn.should('exist');
        p.changeBtn.should('exist');
        p.deleteBtn.should('exist');
        p.searchBtn.should('exist');
    });

    it('1-35', function () {
        p.addBtn.click();

        // 捜索者情報登録画面に画面遷移すること
        cy.location('pathname').should('include', 'group_new.html');
    });

    it('1-36', function () {
        const user136 = groups.user136;
        const group136 = groups.group136;

        //テストユーザーを追加
        cy.insertSearcher(user136);
        cy.insertSearchGroup(group136);

        // グループをチェック
        cy.checkGroup(group136.name);

        //編集ボタンクリック
        p.changeBtn.click();

        // 捜索者情報変更画面に画面遷移すること
        cy.location('pathname').should('include', 'group_editing.html');

        // 期待データがあることを確認
        cy.get('input[name="group_name"]').should('have.value', group136.name);

        cy.get('table.notGroup > tbody>tr')
            // calls the 'length' property yielding that value
            .its('length')
            .should('be.at.least', 1);
        cy.contains(user136.phone);

    });


    it('1-37', function () {
        p.searchBtn.click();

        // グループ情報一覧画面に画面遷移すること
        cy.location('pathname').should('include', 'searcher_map.html');
    });


    it('1-38', function () {
        p.backBtn.click();

        // 捜索者情報TOP画面に画面遷移すること
        cy.location('pathname').should('include', 'index_group.html');
    });


    it('1-39', function () {
        //テストユーザーを追加
        const group139 = groups.group139;
        cy.insertSearchGroup(group139);

        // ユーザーデータがあることを確認
        cy.get('tbody>tr')
            .its('length')
            .should('be.at.least', 1);

        // グループをチェック
        cy.checkGroup(group139.name);

        //削除ボタンクリック
        p.deleteBtn.click();

        // 確認ポップアップ表示されること
        cy.on("window:confirm", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.deleteGroupConfirmMsg);
        });
    });

    it('1-40', function () {
        //テストユーザーを追加
        const group140 = groups.group140;
        cy.insertSearchGroup(group140);

        // ユーザーデータがあることを確認
        cy.get('tbody>tr')
            .its('length')
            .should('be.at.least', 1);

        // グループをチェック
        cy.checkGroup(group140.name);

        //削除ボタンクリック
        p.deleteBtn.click();

        // 確認ポップアップ表示されること
        cy.on("window:confirm", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.deleteGroupConfirmMsg);
        });

        // OKの場合、選択ユーザーが削除されること
        cy.contains(group140.name).should('not.exist');
    });

    it('1-41', function () {
        //テストユーザーを追加
        const group141 = groups.group141;
        cy.insertSearchGroup(group141);

        // ユーザーデータがあることを確認
        cy.get('tbody>tr')
            .its('length')
            .should('be.at.least', 1);

        // グループをチェック
        cy.checkGroup(group141.name);

        //削除ボタンクリック
        p.deleteBtn.click();

        // 確認ポップアップ表示されること
        cy.on("window:confirm", (str) => {
            //window:alert is the event which get fired on alert open
            expect(str).to.equal(this.constant.deleteGroupConfirmMsg);
            return false;
        });

        // OKの場合、選択ユーザーが削除されること
        cy.contains(group141.name);
    });



});
