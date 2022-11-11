
// [rule: 撤回了一条消息 ]

function main() {
	if(true){
		
		var data = GetContent()
		var json = JSON.parse(data)
		var final_from_name =  json.revoked_msg.final_from_name
		var content = json.revoked_msg.content
		
		sendText("用户【"+JSON.stringify(final_from_name)+"】撤回的内容是:"+JSON.stringify(content))
	}
}

main()