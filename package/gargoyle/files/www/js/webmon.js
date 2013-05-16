/*
 * This program is copyright © 2008-2010 Eric Bishop and is distributed under the terms of the GNU GPL 
 * version 2.0 with a special clarification/exception that permits adapting the program to 
 * configure proprietary "back end" software provided that all modifications to the web interface
 * itself remain covered by the GPL. 
 * See http://gargoyle-router.com/faq.html#qfoss for more information
 */function saveChanges(){if(updateInProgress)return;updateInProgress=!0,errorList=proofreadAll();if(errorList.length>0)updateInProgress=!1,errorString=errorList.join("\n")+"\n\nChanges could not be applied.",alert(errorString);else{setControlsEnabled(!1,!0),webmonUpdater!=null&&clearInterval(webmonUpdater);var e=document.getElementById("webmon_enabled").checked,t="/etc/init.d/webmon_gargoyle "+(e?"enable":"disable")+"\n",n="/etc/init.d/webmon_gargoyle stop";uci=uciOriginal.clone();if(e){uci.set("webmon_gargoyle","webmon","max_domains",document.getElementById("num_domains").value),uci.set("webmon_gargoyle","webmon","max_searches",document.getElementById("num_searches").value);var r=document.getElementById("ip_table_container").firstChild,i=getTableDataArray(r,!0,!1),s=[],o;for(o=0;o<i.length;o++)s.push(i[o][0].replace(/[\t ]+/,""));uci.remove("webmon_gargoyle","webmon","include_ips"),uci.remove("webmon_gargoyle","webmon","exclude_ips");var u=getSelectedValue("include_exclude");u=="exclude"&&s.length>0?uci.set("webmon_gargoyle","webmon","exclude_ips",s.join(",")):u=="include"&&s.length>0&&uci.set("webmon_gargoyle","webmon","include_ips",s.join(",")),n="/etc/init.d/webmon_gargoyle restart\n"}commands=uci.getScriptCommands(uciOriginal)+"\n"+t+n;var a=getParameterDefinition("commands",commands)+"&"+getParameterDefinition("hash",document.cookie.replace(/^.*hash=/,"").replace(/[\t ;]+.*$/,"")),f=function(e){if(e.readyState==4){webmonEnabled=document.getElementById("webmon_enabled").checked,includeData=[],excludeData=[];var t=document.getElementById("ip_table_container").firstChild;uciOriginal=uci.clone(),setControlsEnabled(!0),updateInProgress=!1,webmonEnabled&&updateMonitorTable(),resetData()}};runAjax("POST","utility/run_commands.sh",a,f)}}function clearHistory(){if(updateInProgress)return;updateInProgress=!0,setControlsEnabled(!1,!0);var e=uciOriginal.get("webmon_gargoyle","webmon","domain_save_path"),t=uciOriginal.get("webmon_gargoyle","webmon","search_save_path"),n="/etc/init.d/webmon_gargoyle stop\nrm -rf "+e+" 2>/dev/null ; rm -rf "+t+" 2>/dev/null";webmonEnabled&&(n+="\n/etc/init.d/webmon_gargoyle start");var r=function(e){if(e.readyState==4){setControlsEnabled(!0),updateInProgress=!1;var t=["webmon_domain_table_container","webmon_search_table_container"],n;for(n=0;n<t.length;n++)tableContainer=document.getElementById(t[n]),tableContainer.firstChild!=null&&tableContainer.removeChild(tableContainer.firstChild);setElementEnabled(document.getElementById("domain_host_display"),webmonEnabled),setElementEnabled(document.getElementById("search_host_display"),webmonEnabled),webmonEnabled&&updateMonitorTable()}},i=getParameterDefinition("commands",n)+"&"+getParameterDefinition("hash",document.cookie.replace(/^.*hash=/,"").replace(/[\t ;]+.*$/,""));runAjax("POST","utility/run_commands.sh",i,r)}function proofreadAll(){var e=function(e){return validateNumericRange(e,1,9999)};return proofreadFields(["num_domains","num_searches"],["num_domains_label","num_searches_label"],[e,e],[0,0],["num_domains_label","num_searches_label"])}function getHostDisplay(e,t){var n=e;return t=="hostname"&&ipToHostname[e]!=null&&(n=ipToHostname[e],n=n.length<25?n:n.substr(0,22)+"..."),n}function resetData(){document.getElementById("webmon_enabled").checked=webmonEnabled;var e=uciOriginal.get("webmon_gargoyle","webmon","max_domains"),t=uciOriginal.get("webmon_gargoyle","webmon","max_searches");document.getElementById("num_domains").value=e==""?300:e,document.getElementById("num_searches").value=t==""?300:t;var n=[];uciOriginal.get("webmon_gargoyle","webmon","exclude_ips")!=""?(n=uciOriginal.get("webmon_gargoyle","webmon","exclude_ips").split(/,/),setSelectedValue("include_exclude","exclude")):uciOriginal.get("webmon_gargoyle","webmon","include_ips")!=""?(n=uciOriginal.get("webmon_gargoyle","webmon","include_ips").split(/,/),setSelectedValue("include_exclude","include")):setSelectedValue("include_exclude","all");var r=[];while(n.length>0)r.push([n.shift()]);var i=createTable([""],r,"ip_table",!0,!1),s=document.getElementById("ip_table_container");s.firstChild!=null&&s.removeChild(s.firstChild),s.appendChild(i),setIncludeExclude(),setWebmonEnabled();var o=["webmon_domain_table_container","webmon_search_table_container"],u;for(u=0;u<o.length;u++)s=document.getElementById(o[u]),s.firstChild!=null&&s.removeChild(s.firstChild);webmonEnabled&&(updateMonitorTable(),webmonUpdater!=null&&clearInterval(webmonUpdater),webmonUpdater=setInterval("updateMonitorTable()",1e4)),setElementEnabled(document.getElementById("domain_host_display"),webmonEnabled),setElementEnabled(document.getElementById("search_host_display"),webmonEnabled),setElementEnabled(document.getElementById("download_domain_button"),webmonEnabled),setElementEnabled(document.getElementById("download_search_button"),webmonEnabled)}function setIncludeExclude(){document.getElementById("add_ip_container").style.display=getSelectedValue("include_exclude")=="all"?"none":"block"}function setWebmonEnabled(){var e=document.getElementById("webmon_enabled").checked,t=["num_domains","num_searches","include_exclude","add_ip"];for(idIndex in t)element=document.getElementById(t[idIndex]),element.disabled=!e,element.readonly=!e,element.style.color=e?"#000000":"#AAAAAA";var n=document.getElementById("add_ip_button");n.className=e?"default_button":"default_button_disabled",n.disabled=!e,addIpTable=document.getElementById("ip_table_container").firstChild,addIpTable!=null&&setRowClasses(addIpTable,e)}function updateMonitorTable(){if(!updateInProgress){updateInProgress=!0;var e="echo domains ; cat /proc/webmon_recent_domains 2>/dev/null; echo searches ; cat /proc/webmon_recent_searches 2>/dev/null ; echo webmon_done",t=getParameterDefinition("commands",e)+"&"+getParameterDefinition("hash",document.cookie.replace(/^.*hash=/,"").replace(/[\t ;]+.*$/,"")),n=function(e){if(e.readyState==4){var t=[],n=e.responseText.split(/[\n\r]+/),r=n!=null;if(r){var i=[],s=[],o="domains",u=getSelectedValue("domain_host_display"),a=0;while(n[a]!="domains"&&a<n.length)a++;for(a++;r&&n[a]!="webmon_done"&&a<n.length;a++)if(n[a]=="searches")o="searches",u=getSelectedValue("search_host_display");else{var f=n[a].split(/[\t]+/);r=r&&parseInt(f[0])!="NaN";var l=new Date;l.setTime(1e3*parseInt(f[0]));var c=uciOriginal.get("gargoyle","global","dateformat"),h=function(e){var t=""+e;return t=t.length==1?"0"+t:t,t},p=h(l.getMonth()+1),d=h(l.getDate()),v=" "+l.getHours()+":"+h(l.getMinutes())+":"+h(l.getSeconds()),m=c==""||c=="usa"?p+"/"+d+v:d+"/"+p+v;m=c=="russia"?d+"."+p+v:m,m=c=="argentina"?d+"/"+p+v:m,m=c=="iso8601"?p+"-"+d+v:m;var g=getHostDisplay(f[1],u),y=f[2];if(o=="domains"){var b=document.createElement("a");b.setAttribute("href","http://"+y);var w=y;w.length>43&&(w=w.substr(0,40)+"..."),b.appendChild(document.createTextNode(w)),i.push([g,m,b])}else{var E=y.replace(/\+/g," ");E.length>43&&(E=E.substr(0,40)+"..."),s.push([g,m,E])}}}if(r){var S=["Local Host","Last Access Time","Website"],x=["Local Host","Last Access Time","Search Text"],T=createTable(S,i,"webmon_domain_table",!1,!1),N=createTable(x,s,"webmon_search_table",!1,!1),C=["webmon_domain_table_container","webmon_search_table_container"],k;for(k=0;k<C.length;k++)tableContainer=document.getElementById(C[k]),tableContainer.firstChild!=null&&tableContainer.removeChild(tableContainer.firstChild),tableContainer.appendChild(C[k].match(/domain/)!=null?T:N)}updateInProgress=!1}};runAjax("POST","utility/run_commands.sh",t,n)}}var updateInProgress,timeSinceUpdate,webmonUpdater=null;