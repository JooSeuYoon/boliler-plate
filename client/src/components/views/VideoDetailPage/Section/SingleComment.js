import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { useSelector } from 'react-redux';
import Axios from 'axios';

function SingleComment(props) {

    const videoId = props.postId;

    const [OpenReply, setOpenReply] = useState(false)

    const [commentValue, setcommentValue] = useState("");
    const user = useSelector(state => state.user);

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    }

    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to </span>
    ]

    const onHandleChange = (event) =>{
        setcommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const cVariable = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId,
            responseTo: props.Comment._id
        }
        Axios.post('/api/comment/saveComment', cVariable).then(response => {
            if(response.data.success){
                console.log(response.data.result);
            }else{
                alert('댓글을 불러올 수 없습니다.')
            }
        })
    }

    return (
        <div>
            <Comment actions={actions}  author = {props.Comment.writer.name} 
            avatar={<Avatar src = {props.Comment.writer.image} alt = "image"/>} 
            content = {<p>{props.Comment.content}</p>} ></Comment>

            {OpenReply && <form style={{ diplay: 'flex' }} onSubmit ={onSubmit}>
                <TextArea style={{ width: '100%', borderRadius: '5px' }}
                    onChange = {onHandleChange} value = {commentValue} placeholder="코멘트를 작성해 주세요." />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick ={onSubmit}>Submit</Button>
            </form>}


        </div>
    )
}

export default SingleComment