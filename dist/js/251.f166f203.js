(self["webpackChunkvue_trainee"]=self["webpackChunkvue_trainee"]||[]).push([[251],{4553:function(e,t,r){"use strict";var s=r(5093),i=r(3856);t["Z"]=(0,i.L)({name:"QField",inheritAttrs:!1,props:s.Cl,emits:s.HJ,setup(){return(0,s.ZP)((0,s.tL)())}})},1410:function(e){e.exports=function(e,t,r){const s=void 0!==e.__vccOpts?e.__vccOpts:e,i=s[t];if(void 0===i)s[t]=r;else for(var l in r)void 0===i[l]&&(i[l]=r[l])}},4251:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return w}});var s=r(9269);const i={class:"window-height flex column justify-center"},l=(0,s._)("h5",{class:"q-ma-none q-pb-xs text-center newPostHeader"},"Create new post",-1),o={class:"newPost"},n=(0,s.Uk)("Post");function a(e,t,r,a,u,d){const c=(0,s.up)("q-input"),m=(0,s.up)("q-btn");return(0,s.wg)(),(0,s.iD)("div",i,[l,(0,s._)("div",o,[(0,s.Wm)(c,{autogrow:"",modelValue:u.title,"onUpdate:modelValue":t[0]||(t[0]=e=>u.title=e),label:"Post Title",error:u.v$.title.$error,"error-message":u.v$.title.$errors[0]?.$message},null,8,["modelValue","error","error-message"]),(0,s.Wm)(c,{autogrow:"",modelValue:u.description,"onUpdate:modelValue":t[1]||(t[1]=e=>u.description=e),label:"Post Description",error:u.v$.description.$error,"error-message":u.v$.description.$errors[0]?.$message},null,8,["modelValue","error","error-message"]),(0,s.Wm)(c,{autogrow:"",modelValue:u.fullText,"onUpdate:modelValue":t[2]||(t[2]=e=>u.fullText=e),label:"Post Text",error:u.v$.fullText.$error,"error-message":u.v$.fullText.$errors[0]?.$message},null,8,["modelValue","error","error-message"])]),(0,s.Wm)(m,{class:"postBtn q-mt-sm q-px-xl q-py-sm self-center",onClick:d.post},{default:(0,s.w5)((()=>[n])),_:1},8,["onClick"])])}var u=r(5261),d=r(7949),c=r(2084),m={name:"NewPost",data(){return{v$:(0,u.ZP)(),imgFile:null,title:"",description:"",fullText:"",sendImgFile:null,existedPostTitles:null}},validations(){return{title:{required:d.C1,minLength:(0,d.Ei)(5),maxLength:(0,d.BS)(50)},description:{required:d.C1},fullText:{required:d.C1,minLength:(0,d.Ei)(20),maxLength:(0,d.BS)(400)}}},methods:{handleUpload(){this.sendImgFile=this.imgFile,this.imgFile=URL.createObjectURL(this.imgFile)},async post(){if(this.v$.$invalid)this.v$.$touch();else try{const e={title:this.title,description:this.description,fullText:this.fullText},t=await this.$store.dispatch("createPost",e);this.$router.push({name:"PostDetailsView",params:{id:t}})}catch(e){(0,c.GE)(e.response.data.error)}}}},p=r(7617),h=r(6053),v=r(9804),f=r(4553),g=r(1410),$=r.n(g);const x=(0,p.Z)(m,[["render",a]]);var w=x;$()(m,"components",{QInput:h.Z,QBtn:v.Z,QField:f.Z})}}]);
//# sourceMappingURL=251.f166f203.js.map