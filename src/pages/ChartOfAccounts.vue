<template>
  <div class="flex flex-col">
    <PageHeader>
      <h1 slot="title" class="text-xl font-bold">{{ _('Chart of Accounts') }}</h1>
      <template slot="actions">
        <SearchBar class="ml-2" />
      </template>
    </PageHeader>
    <div class="flex-1 flex px-8 mt-4">
      <div class="flex-1" v-if="root">
        <div
          class="mt-2 px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-6px"
          v-for="account in allAccounts"
          :key="account.name"
          @click="toggleChildren(account)"
        >
          <div class="flex items-center" :class="`pl-${(account.level) * 8}`">
            <component :is="getIconComponent(account)" />
            <div
              class="ml-3"
              :class="[!account.parentAccount && 'font-semibold']"
            >{{ account.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import frappe from 'frappejs';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';

export default {
  components: {
    PageHeader,
    SearchBar
  },
  data() {
    return {
      root: null,
      accounts: [],
      doctype: 'Account'
    };
  },
  async mounted() {
    this.settings = frappe.getMeta(this.doctype).treeSettings;
    const { currency } = await frappe.getSingle('AccountingSettings');
    this.root = {
      label: await this.settings.getRootLabel(),
      balance: 0,
      currency
    };
    this.accounts = await this.getChildren();
  },
  methods: {
    async toggleChildren(account) {
      if (account.children == null) {
        account.children = await this.getChildren(account.name);
      }
      account.expanded = !account.expanded;
      this.accounts = this.accounts.slice();
    },
    getIconComponent(account) {
      let icons = {
        'Application of Funds (Assets)': `<svg class="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <path d="M15.333 5.333H.667A.667.667 0 000 6v9.333c0 .368.299.667.667.667h14.666a.667.667 0 00.667-.667V6a.667.667 0 00-.667-.667zM8 12.667a2 2 0 110-4 2 2 0 010 4z" fill="#415668" fill-rule="nonzero"/>
              <path d="M14 2.667V4H2V2.667h12zM11.333 0v1.333H4.667V0h6.666z" fill="#A1ABB4"/>
            </g>
          </svg>`,
        Expenses: `<svg class="w-4 h-4" viewBox="0 0 14 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.668 0v15.333a.666.666 0 01-.666.667h-12a.666.666 0 01-.667-.667V0l2.667 2 2-2 2 2 2-2 2 2 2.666-2zM9.964 4.273H4.386l-.311 1.133h1.62c.933 0 1.474.362 1.67.963H4.373l-.298 1.053h3.324c-.175.673-.767 1.044-1.705 1.044H4.182l.008.83L7.241 13h1.556v-.072L6.01 9.514c1.751-.106 2.574-.942 2.748-2.092h.904l.298-1.053H8.75a2.375 2.375 0 00-.43-1.044l1.342.009.302-1.061z" fill="#415668" fill-rule="evenodd"/>
          </svg>`,
        Income: `<svg class="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <path d="M16 12.859V14c0 1.105-2.09 2-4.667 2-2.494 0-4.531-.839-4.66-1.894L6.667 14v-1.141C7.73 13.574 9.366 14 11.333 14c1.968 0 3.602-.426 4.667-1.141zm0-3.334v1.142c0 1.104-2.09 2-4.667 2-2.494 0-4.531-.839-4.66-1.894l-.006-.106V9.525c1.064.716 2.699 1.142 4.666 1.142 1.968 0 3.602-.426 4.667-1.142zm-4.667-4.192c2.578 0 4.667.896 4.667 2 0 1.105-2.09 2-4.667 2s-4.666-.895-4.666-2c0-1.104 2.089-2 4.666-2z" fill="#415668"/>
              <path d="M0 10.859C1.065 11.574 2.7 12 4.667 12l.337-.005.33-.013v1.995c-.219.014-.44.023-.667.023-2.495 0-4.532-.839-4.66-1.894L0 12v-1.141zm0-2.192V7.525c1.065.716 2.7 1.142 4.667 1.142l.337-.005.33-.013v1.995c-.219.013-.44.023-.667.023-2.495 0-4.532-.839-4.66-1.894L0 8.667V7.525zm0-4.475c1.065.715 2.7 1.141 4.667 1.141.694 0 1.345-.056 1.946-.156-.806.56-1.27 1.292-1.278 2.134-.219.013-.441.022-.668.022-2.578 0-4.667-.895-4.667-2zM4.667 0c2.577 0 4.666.895 4.666 2S7.244 4 4.667 4C2.089 4 0 3.105 0 2s2.09-2 4.667-2z" fill="#A1ABB4"/>
            </g>
          </svg>`,
        'Source of Funds (Liabilities)': `<svg class="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd">
              <path d="M7.332 11.36l4.666-3.734 2 1.6V.666A.667.667 0 0013.332 0h-12a.667.667 0 00-.667.667v14.666c0 .369.298.667.667.667h6v-4.64zm-4-7.36H11.3v1.333H3.332V4zm2.666 8H3.332v-1.333h2.666V12zM3.332 8.667V7.333h5.333v1.334H3.332z" fill="#415668"/>
              <path d="M15.332 12l-3.334-2.667L8.665 12v3.333c0 .369.298.667.667.667h2v-2h1.333v2h2a.667.667 0 00.667-.667V12z" fill="#A1ABB4"/>
            </g>
          </svg>`
      };

      let leaf = `<svg class="w-2 h-2" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
        <circle stroke="#415668" cx="4" cy="4" r="3.5" fill="none" fill-rule="evenodd"/>
      </svg>`;

      let folder = `<svg class="w-3 h-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.333 3.367L6.333.7H.667A.667.667 0 000 1.367v12a2 2 0 002 2h12a2 2 0 002-2V4.033a.667.667 0 00-.667-.666h-7z" fill="#415668" fill-rule="evenodd"/>
      </svg>`;

      let icon = account.isGroup ? folder : leaf;

      let c = {
        template: icons[account.name] || icon
      };

      return c;
    },
    async getChildren(parent = '') {
      const children = await frappe.db.getAll({
        doctype: this.doctype,
        filters: {
          parentAccount: parent
        },
        fields: [
          'name',
          'parentAccount',
          'isGroup',
          'balance',
          'rootType',
          '0 as expanded'
        ],
        orderBy: 'name',
        order: 'asc'
      });

      return children;
    },
    updateBalance(balance) {
      this.root.balance += balance;
    }
  },
  computed: {
    allAccounts() {
      let allAccounts = [];
      getAccounts(this.accounts, 0);
      return allAccounts;

      function getAccounts(accounts, level) {
        for (let account of accounts) {
          account.level = level;
          allAccounts.push(account);
          if (account.children != null && account.expanded) {
            getAccounts(account.children, level + 1);
          }
        }
      }
    }
  }
};
</script>