import React, { useState } from "react";
import Axios from 'axios'
import {useSelector } from 'react-redux' 
import {Button, Input} from 'antd'
import TextArea from "antd/lib/input/TextArea";

function Comment(props){

    const videoId = props.postId;
    const [commentVlue, setcommentValue] = useState("");
    const user = useSelector(state => state.user);

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const cVariable = {
            content: commentVlue,
            writer: user.userData._id,
            postId: videoId
        }
        Axios.post('/api/comment/saveComment', cVariable).then(response => {
            if(response.data.success){
                console.log(response.data.result);
            }else{
                alert('댓글을 불러올 수 없습니다.')
            }
        })
    }

    return(
        <div>
            <br />
            <p>Replies</p>
            <hr />

            { /*comments list*/}
            {/*Rootcomments Form*/}

            <form style={{diplay: 'flex'}} onSubmit = {onSubmit}>
                <TextArea style={{width: '100%', borderRadius: '5px'}} 
                        onChange = {handleClick} value = {commentVlue} placeholder="코멘트를 작성해 주세요." />
                <br />
                <Button style={{width:'20%', height: '52px'}} onClick = {onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default Comment;