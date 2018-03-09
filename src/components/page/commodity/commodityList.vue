/** 
    商品管理
    商品列表
**/
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search">搜索</el-button>
        </div>
        <div class="block">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="pageNum"
                :page-size="11"
                layout="prev, pager, next, jumper"
                :total="pageCount">
            </el-pagination>
        </div>
        <el-table
            :data="goodsInfo"
            style="width: 100%"
            border
            :default-sort = "{prop: 'shop_id', order: 'descending'}">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="店铺ID">
                    <span>{{ props.row.shop_id }}</span>
                </el-form-item>
                <el-form-item label="店铺名称">
                    <span>{{ props.row.shop_name }}</span>
                </el-form-item>
                <el-form-item label="商品 ID">
                    <span>{{ props.row.goods_id }}</span>
                </el-form-item>
                <el-form-item label="商品名称">
                    <span>{{ props.row.goods_name }}</span>
                </el-form-item>
                <el-form-item label="分类ID（系统）">
                    <span>{{ props.row.system_category_id }}</span>
                </el-form-item>
                <el-form-item label="分类名（系统）">
                    <span>{{ props.row.category_name }}</span>
                </el-form-item>
                <el-form-item label="分类ID（店铺）">
                    <span>{{ props.row.shop_goods_category_id }}</span>
                </el-form-item>
                <el-form-item label="分类名（店铺）">
                    <span>{{ props.row.shop_goods_category_name }}</span>
                </el-form-item>
                <el-form-item label="商品默认价格">
                    <span>{{ props.row.goods_price / 100}}</span>
                </el-form-item>
                <el-form-item label="商品图片">
                    <template scope="scope">
                        <el-button size="small"
                            @click="showPhone(props.row.goods_image)" 
                            >
                            {{ props.row.goods_image | goodsImg }}
                        </el-button>
                    </template>
                </el-form-item>
                <el-form-item label="商品详情">
                    <span>{{ props.row.goods_details }}</span>
                </el-form-item>
                <el-form-item label="是否为推荐商品">
                    <span>{{ props.row.recommend | recom }}</span>
                </el-form-item>
                <el-form-item label="商品状态">
                    <span>{{ props.row.goods_state | gosState }}</span>
                </el-form-item>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
                label="店铺ID"
                prop="shop_id"
                width="80"
                sortable>
            </el-table-column>
            <el-table-column
                label="店铺名称"
                prop="shop_name">
            </el-table-column>
            <el-table-column
                label="商品名称"
                prop="goods_name">
            </el-table-column>
            <el-table-column
                label="商品价格"
                prop="goods_price"
                sortable>
                <template scope="scope">
                    {{ scope.row.goods_price / 100 }}
                </template>
            </el-table-column>
            <el-table-column
                label="分类名（店铺）"
                prop="shop_goods_category_name">
            </el-table-column>
            <el-table-column
                label="商品状态"
                prop="goods_state">
                <template scope="scope">
                    {{ scope.row.goods_state | goState }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" type="primary"
                        @click="handleEdit(scope.row,scope.$index)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="商品图片" :visible.sync="dialogVisible" width="27%">
            <img :src="showImg" alt="">
        </el-dialog>

        <el-dialog title="商品信息编辑" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="商品状态" label-width="100px">
                    <el-select v-model="goodsState">
                        <el-option label="删除" value="0"></el-option>
                        <el-option label="下架" value="1"></el-option>
                        <el-option label="上架" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="FormConfirm()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                commInfo: '',
                pageNum: 1,
                pageCount: '',
                select_word: '',
                dialogVisible: false,
                showImg: '',
                goodsState: '',
                dialogFormVisible: false,
                saveGoodsID: '',
                goodsIndex: ''
            }
        },
        created () {
            this.getData(1)
        },
        computed: {
            //搜素过滤
            goodsInfo() {
                let search = this.select_word;
                if (search) {
                    return this.commInfo.filter(function(v) {
                        return Object.keys(v).some(function(key) {
                            return String(v[key]).toLowerCase().indexOf(search) > -1
                        })
                    })   
                }
                return this.commInfo;
            }
        },
        methods: {
            getData(i) {
                let self = this;
                this.$axios({
                    method: 'post',
                    url: self.API + 'GetGoodsList',
                    data: {
                        e_page_number: 11,
                        page: i
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    self.commInfo = res.data.data.data
                    self.pageCount = res.data.data.PageCount * 11
                })
            },
            setGoodsState() {
                let self = this
                this.$axios({
                    method: 'post',
                    url: self.API + 'SetGoodsState',
                    data: {
                        goods_id: this.commInfo[this.goodsIndex].goods_id,
                        state: self.goodsState
                    },
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }).then((res) => {
                    console.log(res.data.data)
                    if (res.data.error == 0) {
                        self.$message({
                            message: '商品状态设置成功',
                            type: 'success'
                        });
                        self.getData(this.pageNum)
                    } else {
                        self.$message.error('商品状态设置失败');
                    }
                })
            },
            showPhone(i) {
                this.showImg = ''
                this.dialogVisible = true
                this.showImg = i
            },
            handleEdit(v,i) {
                this.dialogFormVisible = true
                if (v.goods_state == 0) {
                    this.goodsState = '删除'
                } else if (v.goods_state == 1) {
                    this.goodsState = '下架'
                } else if (v.goods_state == 2) {
                    this.goodsState = '上架'
                }
                this.goodsIndex = i
            },
            FormConfirm() {
                if (this.goodsState == 0 || this.goodsState == 1 || this.goodsState == 2 && this.goodsState != this.commInfo[this.goodsIndex].goods_state) {
                    this.setGoodsState()
                }
                this.dialogFormVisible = false
            },
            handleCurrentChange(val) {
                this.pageNum = val
                this.getData(this.pageNum)
            }
        },
        filters: {
            goState(v) {
                if (v == 0) {
                    return '已删除'
                } else if (v == 1) {
                    return '下架'
                } else if (v == 2) {
                    return '上架'
                }
            },
            recom(v) {
                return v == 1 ? '是' : '否'
            },
            goodsImg(v) {
                return v != '' ? '查看' : '空'
            }
        }
    }
</script>


<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
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
    .block {
        position: fixed;
        top: 140px;
        right: 50px;
    }
</style>

