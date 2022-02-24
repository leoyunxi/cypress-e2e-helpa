
declare namespace Cypress {
    interface Chainable {
        /**
         * 捜索者を追加するコマンド.
         * @example cy.addSearcher(userObj)
         */
        addSearcher(user: Searcher): Chainable<Element>

        /**
         * ユーザーのチェックボックスをクリック.
         * @example cy.checkUser(userName)
         */
        checkUser(name: string): Chainable<Element>

        /**
         * 指定電話番号のユーザーを削除.
         * @example cy.deleteUser(phone)
         */
        deleteUser(phone: string): Chainable<Element>

        /**
         * 指定電話番号のユーザーを編集.
         * @example cy.editUser(phone)
         */
        editUser(phone: string): Chainable<Element>

        /**
         * テストユーザーを削除.
         * @example cy.deleteUser(phone)
         */
        cleanup(): Chainable<Element>



        /**
         * グループのチェックボックスをクリック.
         * @example cy.checkUser(groupName)
         */
        checkGroup(name: string): Chainable<Element>


        /**
         * グループのチェックボックスをクリック.
         * @example cy.checkNotGroupUser(userName)
         */
        checkNotGroupUser(name: string): Chainable<Element>


        /**
         * グループのチェックボックスをクリック.
         * @example cy.checkGroupUser(userName)
         */
        checkGroupUser(name: string): Chainable<Element>


        /**
         * グループのユーザーを追加
         * @example cy.addGroupUser(user,group)
         */
        addGroupUser(user: Searcher,group:Group): Chainable<Element>


        /**
         * 捜索者をSQLより追加するコマンド.（テストデータ事前準備用）
         * @example cy.addSearcher(userObj)
         */
        insertSearcher(user: Searcher): Chainable<Element>

        /**
         * 捜索者グループをSQLより追加するコマンド.（テストデータ事前準備用）
         * @example cy.addSearcher(userObj)
         */
        insertSearchGroup(group: Group): Chainable<Element>
    }
}