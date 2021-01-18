<template>
  <d2-container>
    <template slot="header">
      <private-head
        :value.sync="form.value"
        @search="search"
        @add="add"
      />
    </template>
    <private-table
      ref="table"
      @edit="edit"
    />
    <add-dialog
      :visible.sync="dialog.add.visible"
      @updateTable="updateTable"
    />
    <edit-dialog
      :data="dialog.edit.data"
      :visible.sync="dialog.edit.visible"
      @updateTable="updateTable"
    />
  </d2-container>
</template>

<script>
import PrivateHead from './head'
import PrivateTable from './table'
import AddDialog from './addDialog'
import EditDialog from './editDialog'
export default {
  components: { PrivateHead, PrivateTable, AddDialog, EditDialog },
  data () {
    return {
      form: {
        value: ''
      },
      dialog: {
        add: {
          visible: false
        },
        edit: {
          data: {},
          visible: false
        }
      }
    }
  },
  methods: {
    search () {
      console.log(this.form.value)
    },
    updateTable () {
      this.$refs.table.getData()
    },
    add () {
      this.dialog.add.visible = true
    },
    edit (data) {
      this.dialog.edit.data = data
      this.dialog.edit.visible = true
    }
  }
}
</script>
