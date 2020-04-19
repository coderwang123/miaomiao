<template>
    <div class="city_body">
        <div class="city_list">
            <div class="city_hot">
                <h2>热门城市</h2>
                <ul class="clearfix">
                    <li v-for="item in hostList" :key="item.id">{{item.nm}}</li>
                </ul>
            </div>
            <div class="city_sort" ref="city_sort">
                <div v-for="item in cityList" :key="item.index">
                    <h2>{{item.index}}</h2>
                    <ul>
                        <li v-for="itemList in item.list" :key="itemList.id">{{itemList.nm}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="city_index">
            <ul>
                <li v-for="(item,index) in cityList" :key="item.index"  @touchstart="handleToIndex(index)">{{item.index}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "City",
        data(){
            return {
                cityList:[],
                hostList:[]
            }
        },
        mounted(){
            this.$axios.get('/api/cityList').then(res=>{
                var msg = res.data.msg
                if(msg === 'ok'){
                    var cities = res.data.data.cities;
                    // 设计城市模式
                    // [ { index : 'A' , list:[{ nm : '阿城' , id : 123}] } ]
                    console.log(cities)
                    var { cityList , hotList } = this.formatCityList(cities)
                    this.cityList = cityList;
                    this.hotList = hotList;
                }
            })
        },
        methods:{
            formatCityList(cities){
                var cityList = [];
                var hotList = [];
                // 热门城市（不需要检索和排序）
                for(var i = 0 ; i<cities.length ; i++){
                    if(cities[i].isHot === 1 ){
                        hotList.push(cities[i])
                    }
                }

                // 分类城市（需要检索和排序）
                for(var i=0;i<cities.length;i++){
                    // 循环遍历数组，用 substring 截取 每个对象中的py属性的第一个字母 给它转换成大写，当索引
                    var firstLetter = cities[i].py.substring(0,1).toUpperCase();
                    if(toCom(firstLetter)){ //新添加索引
                        cityList.push( { index:firstLetter,list:[{nm:cities[i].nm , id:cities[i].id}] } )
                    }else { // 累加到已有 index 中
                        for(var j=0;j<cityList.length;j++){
                            // 此时，说明cityList数组中，有当前对应城市的索引了，只需要把城市添加到 list 数组中即可
                            // 判断，当我里面的索引值，和外面截取的索引值 相同时候，往里添加 城市
                            if(cityList[j].index === firstLetter){
                                cityList[j].list.push( {nm:cities[i].nm , id:cities[i].id} )
                            }
                        }
                    }
                }

                cityList.sort((a,b)=>{
                    if(a.index > b.index){
                        return 1
                    }else if (a.index < b.index){
                        return -1
                    }else {
                        return 0
                    }
                })

                function toCom(firstLetter) {
                    for (var i = 0; i<cityList.length;i++){
                        // 遍历 citylist 数组 ，判断数组中 index属性 是不是和 截取的字母一样，
                        // 如果一样了 就返回false，这样就不会进入判断语句，会进入esle，实现累加。
                        if(cityList[i].index === firstLetter){
                            return false
                        }
                    }
                    // 如果不一样 就返回 true，这样就代表数组里没有 这个字母，进去if中添加新的索引
                    return true
                }
                // 把结果返回出去
                return{
                    cityList,
                    hotList
                }
            },
            handleToIndex(index){
                var h2 = this.$refs.city_sort.getElementsByTagName('h2')
                this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop
            }
        }
    }
</script>

<style scoped>
    #content .city_body{ margin-top: 45px; display: flex; width:100%; position: absolute; top: 0; bottom: 0;}
    .city_body .city_list{ flex:1; overflow: auto; background: #FFF5F0;}
    .city_body .city_list::-webkit-scrollbar{
        background-color:transparent;
        width:0;
    }
    .city_body .city_hot{ margin-top: 20px;}
    .city_body .city_hot h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
    .city_body .city_hot ul{}
    .city_body .city_hot ul li{ float: left; background: #fff; width: 29%; height: 33px; margin-top: 15px; margin-left: 3%; padding: 0 4px; border: 1px solid #e6e6e6; border-radius: 3px; line-height: 33px; text-align: center; box-sizing: border-box;}
    .city_body .city_sort{}
    .city_body .city_sort div{ margin-top: 20px;}
    .city_body .city_sort h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
    .city_body .city_sort ul{ padding-left: 10px; margin-top: 10px;}
    .city_body .city_sort ul li{ line-height: 30px; line-height: 30px;}
    .city_body .city_index{ width:20px; display: flex; flex-direction:column; justify-content:center; text-align: center; border-left:1px #e6e6e6 solid;}
</style>