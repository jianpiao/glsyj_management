/** 
    分类管理
    商品分类
**/
<template>
    <section class="main">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 分类管理</el-breadcrumb-item>
                <el-breadcrumb-item>店铺分类（拖动排序）</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="add">添加分类</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        <div class="drap-name">
            <span class="name1">分类ID</span>
            <span class="name2">分类名称</span>
        </div>
        <div class="drag-box-left">
            <div class="drag-list" draggable="true" 
                v-for="(list,index) in classData" 
                :data-id="list.shop_category_id" 
                @dragstart="dragstartEvent"
                @dragend="dragendEvent"
                @dragenter="dragenterEvent"
                @dragleave="dragleaveEvent"
                @dragover="dragoverEvent"
            >
               <span class="id">{{list.system_category_id}}  </span>   
               <span>{{list.category_name}}</span>
               <el-button size="small" type="danger" class="button"
                    @click="handleDelete(index,list)">删除
                </el-button>
            </div>
        </div>

        <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="输入新的分类名" label-width="110px">
                    <el-input v-model="name" auto-complete="off" placeholder="新的分类名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm()">确 定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                dragElement: null,
                lock: true,
                classInfo: '',
                select_word: '',
                saveSort: [],
                dialogFormVisible: false, 
                name: ''
            }
        },
        created () {
            this.getData()
        },
        computed: {
            //搜素过滤
            classData() {
                let search = this.select_word;
                if (search) {
                    return this.classInfo.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.classInfo;
            }
        },
        methods: {
            getData() {
                let self = this;
                this.$axios.post(self.API + 'GoodsSystemCategoryList').then((res) => {
                    console.log(res.data.data)
                    self.classInfo = res.data.data
                })
            },
            dragstartEvent(ev) {
                const self = this;
                self.dragElement = ev.target;
                ev.target.style.backgroundColor = '#f8f8f8';
            },
            dragendEvent(ev) {
                ev.target.style.backgroundColor = '#fff';
                ev.preventDefault();
                //  获取排序后的数据内容
                    console.log(ev.target.parentNode)
                        //  每次变更排序清空数组
                        this.saveSort = []
                        //  遍历变更后的节点  获取节点里面的id   和名称
                        for (let i = 0; i < ev.target.parentNode.children.length; i++) {
                            //  获取之后添加到和数组里面
                            this.saveSort.push({
                                system_category_id: ev.target.parentNode.children[i].getElementsByTagName('span')[0].innerText,
                                priority: i
                            })
                        }
                        //  保存排序
                        this.setSort()
            },
            dragenterEvent(ev) {
                //  拖拽按下
                const self = this;
                if(self.dragElement != ev.target){
                    ev.target.parentNode.insertBefore(self.dragElement, ev.target);
                }
            },
            dragleaveEvent(ev) {
                //  拖拽离开
                const self = this;
                if(self.dragElement != ev.target){
                    if(self.lock && (ev.target == ev.target.parentNode.lastElementChild || ev.target == ev.target.parentNode.lastChild)){
                        ev.target.parentNode.appendChild(self.dragElement);
                        self.lock = false;
                    }else{
                        self.lock = true;
                    }
                }
            },
            dragoverEvent(ev) {
                //  拖拽经过
                ev.preventDefault();
            },
            setSort() {
                //  保存排序后的数组提交到数据库
                let self = this;
                this.$axios.post(self.API + 'SortGoodsSystemCategoryList',{
                    list_order: JSON.stringify(self.saveSort)
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error != 0) {
                        self.$message.error("排序失败")
                    }
                })
            },
            addCategory(i) {
                //  添加分类
                let self = this
                this.$axios.post(self.API + 'AddGoodsSystemCategory',{
                    category_name: i
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0) {
                        self.$message({
                            type: "success",
                            message: "添加成功!"
                        });
                        //  刷新列表
                        self.getData()
                    } else {
                        self.$message.error("添加失败")
                    }
                })
            },
            deleteCategory(v) {
                //  删除分类
                let self = this
                this.$axios.post(self.API + "DeleteGoodsSystemCategory",{
                    system_category_id: v
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0) {
                        self.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        //  刷新列表
                        self.getData()
                    } else {
                        self.$message.error("删除失败")
                    }
                })
            },
            handleDelete(i,v) {
                //  点击删除按钮
                let self = this
                this.$confirm('是否确认删除分类名  [ '+ v.shop_category_name +" ]", '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        self.deleteCategory(v.system_category_id)
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                    });          
                });
            },
            add() {
                console.log(JSON.stringify(this.saveSort))
                //  添加分类名
                // this.name = ''
                // this.dialogFormVisible = true
            },
            addConfirm() {
                if (this.name != '') {
                    this.addCategory(this.name)
                }
                this.dialogFormVisible = false
            }
        }
    }
</script>

<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }

    .drag-box-left{
        float: left;
        width: 100%;
    }
    .drag-list{
        border: 1px solid #eee;
        padding:10px 10px 10px 30px;
        margin-top: 10px;
        transition: border .3s;
    }
    .drag-list:hover{
        border: 1px solid #20a0ff;
    }
    .drag-title{
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

    .id {
        margin-right: 70px;
    }

    .name1 {
        margin-left: 10px;
    }

    .name2 {
        margin-left: 50px;
    }

    .button {
        position: absolute;
        right: 5%;
        margin: -4px;
    }
</style>