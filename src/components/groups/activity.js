import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { Avatar, List, Divider, Skeleton  } from 'antd';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import NewExpense from '../misc/newExpense';
import InfiniteScroll from 'react-infinite-scroll-component';
import {fetchActivity} from '../service/account-service';
import Loader from '../misc/loader';
import NoData from '../misc/nodata';
import { GiExpense } from "react-icons/gi";


  function GroupExpense(props) {
    const { groupId } = useParams();
    const location = useLocation();
    console.log(location);
    const { title } = location.state || {};
    console.log('group===>', title )
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nodata, setNodata] = useState(false);
    
    const loadMoreData = () => {
      if (loading) {
        console.log('loffff')
        return;
      }
      setLoading(true);
      fetchData();
    }

    const fetchData = async () => {
      try {
        const data = await fetchActivity();
        if (data){
          setData(data);
          setIsLoading(false);
          setLoading(false);
        }
        else{
          setNodata(true);
          setIsLoading(false);
          setLoading(false);
          throw new Error('Fetching account details failed');
        }
      } catch (error) {
        console.error('Fetching account details failed:', error);
          setNodata(true);
          setIsLoading(false);
          
      }
    };

    useEffect(() => {    
      loadMoreData();
    }, []);
    
  
  return (
    isLoading ? <Loader /> 
    : 
      nodata ? <NoData /> :
    <Container>
        <Row>
            <h3>{props.title}</h3>
        </Row>
        <InfiniteScroll
        dataLength={data.length}
        next={fetchData}
        hasMore={loading}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                    avatar={<Avatar style={{backgroundColor: '#A6002F', height: '40px', width: '40px', alignItems: 'center'}} icon={<GiExpense style={{verticalAlign:'bottom'}} />}/>}
                    title={<span>{item.paid_by.toUpperCase()} added "<b>{item.item.toUpperCase()}</b>" in "<b>{item.group.toUpperCase()}</b>"</span>}
                    description = {item.share <0 ? <span className='orange-clr'>You will pay INR {0-item.share}</span> : <span className='green-clr'>You will get INR {item.share}</span>}
                    />
                    <div className='d-flex flex-column align-items-end'>
                      <span className='orange-clr'>{item.timestamp.split(",")[0]}</span>
                      <span className='orange-clr'>{item.timestamp.split(",")[1]}</span>
                    </div>
                </List.Item>
                )}
            /> 
        </InfiniteScroll>
        <Row className='my-4' style={{zIndex: '2000000', position:'fixed', right:'230px', bottom: '80px'}}>
            <NewExpense />
        </Row>  
    </Container>
  )
}

export default GroupExpense
