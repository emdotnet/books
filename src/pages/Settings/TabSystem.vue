<template>
  <div>
    <TwoColumnForm v-if="doc" :doc="doc" :fields="fields" :autosave="true" />
  </div>
</template>

<script>
import frappe from 'frappejs';
import TwoColumnForm from '@/components/TwoColumnForm';

export default {
  name: 'TabSystem',
  components: {
    TwoColumnForm,
  },
  data() {
    return {
      doc: null,
    };
  },
  async mounted() {
    this.doc = frappe.SystemSettings;
    this.companyName = frappe.AccountingSettings.companyName;
  },
  computed: {
    fields() {
      let meta = frappe.getMeta('SystemSettings');
      return meta.getQuickEditFields();
    },
  },
};
</script>
