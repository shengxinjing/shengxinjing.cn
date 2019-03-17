<template>
    
    <div >
        亲爱的小蘑菇，今天是 {{today}} 我们从{{start}}在一起，已经 <span class="green"> {{offset}}</span>天啦
    </div>

</template>

<script>
import dayjs from 'dayjs'
export default {
    data(){
        return {
            today: dayjs().format('YYYY-MM-DD'),
            start: '2015-03-28',
            offset:0,
        }

    },
    created(){
        this.offset = dayjs().diff(dayjs(this.start),'day')
    }
}
</script>

<style>

.green{
    color:#3eaf7c;
}
</style>
