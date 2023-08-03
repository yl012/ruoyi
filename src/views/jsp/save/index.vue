<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属人 " prop="saveWithuser">
        <el-input
          v-model="queryParams.saveWithuser"
          placeholder="请输入所属人 "
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分数" prop="saveScore">
        <el-input
          v-model="queryParams.saveScore"
          placeholder="请输入分数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="saveCreatetime">
        <el-date-picker clearable
          v-model="queryParams.saveCreatetime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['jsp:save:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['jsp:save:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['jsp:save:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['jsp:save:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="saveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="saveId" />
      <el-table-column label="所属人 " align="center" prop="saveWithuser" />
      <el-table-column label="地址" align="center" prop="savePath" >
        <template slot-scope="scope">
          <el-link type="primary" :href="scope.row.savePath" target="_blank">查看</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分数" align="center" prop="saveScore" />
      <el-table-column label="所属套题" align="center" prop="withTest" />
      <el-table-column label="创建时间" align="center" prop="saveCreatetime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.saveCreatetime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="saveRemark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['jsp:save:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['jsp:save:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改试验记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属人 " prop="saveWithuser">
          <el-input v-model="form.saveWithuser" placeholder="请输入所属人 " />
        </el-form-item>
        <el-form-item label="地址" prop="savePath">
          <el-input v-model="form.savePath" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分数" prop="saveScore">
          <el-input v-model="form.saveScore" placeholder="请输入分数" />
        </el-form-item>
        <el-form-item label="创建时间" prop="saveCreatetime">
          <el-date-picker clearable
            v-model="form.saveCreatetime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="saveRemark">
          <el-input v-model="form.saveRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSave, getSave, delSave, addSave, updateSave } from "@/api/jsp/save";

export default {
  name: "Save",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 试验记录表格数据
      saveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        saveWithuser: null,
        savePath: null,
        saveScore: null,
        saveCreatetime: null,
        saveRemark: null,
        withTest:null,
        userName: localStorage.getItem('online')
      },
      // 表单参数
      form: {
        userName: localStorage.getItem('online')
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.queryParams.userName = localStorage.getItem('online')
    this.form.userName = localStorage.getItem('online')
    this.getList();
  },
  methods: {
    /** 查询试验记录列表 */
    getList() {
      this.loading = true;
      listSave(this.queryParams).then(response => {
        this.saveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        saveId: null,
        saveWithuser: null,
        savePath: null,
        saveScore: null,
        saveCreatetime: null,
        withTest:null,
        saveRemark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.saveId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加试验记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const saveId = row.saveId || this.ids
      getSave(saveId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改试验记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.saveId != null) {
            updateSave(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            console.log(this.form)
            this.form.userName = localStorage.getItem('online')
            addSave(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const saveIds = row.saveId || this.ids;
      this.$modal.confirm('是否确认删除试验记录编号为"' + saveIds + '"的数据项？').then(function() {
        return delSave(saveIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('jsp/save/export', {
        ...this.queryParams
      }, `save_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
