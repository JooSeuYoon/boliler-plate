import { Avatar, Col, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Title from 'antd/lib/typography/Title';
import Axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'

function SubscriptionPage(){

    const [Video, setVideo] = useState([])

    useEffect(()=>{

        const subVariable = {
            userFrom : localStorage.getItem('userId')
        }

        Axios.post('/api/video/getSubscriptionVideos', subVariable).then(response => {
            if(response.data.success){
                setVideo(response.data.videoDetail)
            }else{
                alert('비디오 가져오기를 실패 했습니다.');
            }
        })
    },[])

    const renderCard = Video.map((video, index) => {

        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg = {6} md = {8} xs = {24}>
        <a href={`/video/${video._id}`}>
        <div style={{position: 'relative'}}>
            <img style={{width: '100%'}} src = {`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
            <div className="duration">
                <span>{minutes} : {seconds}</span>
            </div>
        </div>
        </a>
        <br />
        <Meta avatar = {<Avatar src={video.writer.image} />} title = {video.title} description = ""/>
        <span>{video.writer.name}</span>
        <span style={{marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        {}
    </Col>
    })
    return (
        <div style={{ width: '85%', margin: '3rem auto'}}>
            <Title level = {2}>Recommened</Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCard}
                
            </Row>
        </div>
    )
}

export default SubscriptionPage