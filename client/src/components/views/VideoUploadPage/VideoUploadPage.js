import React, {useState} from 'react';
import { Button, Icon, Form, message} from 'antd'
import Dropzone from 'react-dropzone'
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
    {value: 4, label: "Game"},
]

function VideoUploadPage(props){
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [thumbnailPath, setThumbnailPath] = useState("");

    const onTitleChange = (event) => {
        setVideoTitle(event.currentTarget.value);
    }

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value);
    }

    const onPrivateChange = (event) => {
        setPrivate(event.currentTarget.value);
    }

    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value);
    }

    const onDrop = (Files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multiplart/form-data'}
        }

        formData.append("file", Files[0]);

        Axios.post('/api/video/uploads', formData, config).then(response => {
            if(response.data.success){

                let variable = {
                    filePath: response.data.filePath,
                    fileName: response.data.fileName
                }

                setFilePath(response.data.filePath);

                Axios.post('/api/video/thumbnail', variable).then(response => {
                    if(response.data.success){
                        alert('썸네일 생성에 성공하였습니다.')
                        setDuration(response.data.fileDuration);
                        setThumbnailPath(response.data.filePath);
                        console.log(thumbnailPath);
                        console.log(Duration);

                    }else{
                        alert('썸네일 생성에 실패하였습니다.')
                    }
                })
            }else{
                alert('비디오 업로드에 실패하였습니다.');
            }
        })
    }

    const onSubmit = (event) =>{
        event.preventDefault();
        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: thumbnailPath,
        }
        Axios.post('/api/video/uploadVideo', variables).then(response => {
            if(response.data.success){
                message.success('비디오 업로드에 성공하였습니다.')
                props.history.push('/');
            }else{
                alert('비디오 업로드에 실패하였습니다.')
            }
        })
    }

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style = {{ textAlign: 'center', marginBottom:'2rem'}}>
                <Title level = {2}>Upload Video</Title>
            </div>

            <Form onSubmit = {onSubmit}>
                <div style={{ display : 'flex', justifyContent: 'space-between'}}>
                    { /* Drop zone */}
                    <Dropzone onDrop = {onDrop} multiple = {false} maxSize = {100000000}>
                        {({ getRootProps, getInputProps}) => (
                            <div style={{ width : '300px', height: '240px', border:'1px solid lightgray',
                         display: 'flex' ,alignItems: 'center', justifyContent: 'center'}}
                         {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{fontSize: '3rem'}} />
                        </div>
                        )}
                    </Dropzone>
                    {/* Thumb zone */}

                    {thumbnailPath &&
                        <div>
                            <img src = {`http://localhost:5000/${thumbnailPath}`} alt = "thumbnail" />
                        </div>
                    }
                
                </div>

                <br />
                <br />
                <label>Title</label>
                <br/>
                <input onChange = {onTitleChange} value = {VideoTitle}/>
                
                <br />
                <br />
                <label>Description</label>
                <TextArea onChange = {onDescriptionChange} value = {Description} />

                <br />
                <br />

                <select onChange = {onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />

                <select onChange = {onCategoryChange}>
                {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />

                <Button type = "primary" size="large" onClick = {onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage