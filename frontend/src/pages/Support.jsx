import React, {useState, useEffect} from 'react';
import { SearchForm } from '../components/commons/SearchForm.jsx';
import { MenuList } from '../components/commons/MenuList.jsx';
import { axiosData } from '../utils/dataFetch.js';

export function Support() {
    const [menus, setMenus] = useState([]);
    const [category, setCategory] = useState([]);
    const [list, setList] = useState([]);  

    useEffect(()=>{
        const fetch = async() => {
            const jsonData = await axiosData("/data/support.json");
            setMenus(jsonData.menus);
            setCategory(jsonData.category);
            setList(jsonData.list);
        }
        fetch();
    }, []);

    const filterList = (type) => {
        const filter = async() => {
            const jsonData = await axiosData("/data/support.json");
            if(type === 'all') {
                setList(jsonData.list);
            } else {
                const filterData = jsonData.list.filter((item)=> item.type === type);
                setList(filterData); 
            }
        }
        filter();
    }    

    return (  
        <div className="content">
            <div className="support center-layout">
                <h1 className="center-title">공지/뉴스</h1>
                <div className="support-content">
                    <p style={{color:"#777"}}>CGV의 주요한 이슈 및 여러가지 소식들을 확인할 수 있습니다.</p>
                    <SearchForm category={category}/>
                    <nav><MenuList menus={menus} filterList={filterList} /></nav>
                    <p style={{color:"#777"}}>총 114건이 검색되었습니다. </p>

                    {/* list 내용 출력 - 테이블 */}
                    <table >
                        <thead>
                            <tr>
                                <th>번호</th><th>구분</th><th>제목</th><th>등록일</th><th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list && list.map((item, idx) => 
                                <tr>
                                    <td>{idx + 1}</td>
                                    <td>[{item.type}]</td>
                                    <td>{item.title}</td>
                                    <td>{item.rdate}</td>
                                    <td>{item.hits}</td>
                                </tr>                    
                            )}
                        </tbody>
                        <tfoot>
                            <tr><td colSpan={5}> 1 2 3 4 5 {">>"} </td></tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            
        </div>
    );
}

