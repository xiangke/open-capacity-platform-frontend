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
      :searchKey="form.value"
      ref="table"
      @edit="edit"
      @show="show"
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
    <show-dialog
      :id="dialog.show.id"
      :visible.sync="dialog.show.visible"
    />
  </d2-container>
</template>

<script>
import PrivateHead from './head'
import PrivateTable from './table'
import AddDialog from './addDialog'
import EditDialog from './editDialog'
import ShowDialog from './showDialog'
export default {
  components: { PrivateHead, PrivateTable, AddDialog, EditDialog, ShowDialog },
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
        },
        show: {
          id: null,
          visible: false
        }
      }
    }
  },
  methods: {
    search () {
      this.$refs.table.handleFilter()
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
    },
    show (id) {
      this.dialog.show.id = id
      this.dialog.show.visible = true
    }
  }
}
</script>
