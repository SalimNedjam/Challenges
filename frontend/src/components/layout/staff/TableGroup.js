import React, {Component} from "react";
import {connect} from 'react-redux'
import {Col, Empty, Modal, Row, Table,Collapse,Icon} from 'antd'
import {createMessage} from "../../../actions/messages";
import {forceFetchGroup, forceRemoveGroup} from "../../../actions/application";
import {FiUserMinus} from "react-icons/fi";
import {Link} from "react-router-dom";

const {confirm} = Modal;

export class TableGroup extends Component {

    column = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'Id',
        },
        {
            title: 'Email',
            key: 'Username',
            render: (record) => {
                return <Link
                    to={"/student/" + record.user + "/challenge/" + this.props.challenge}>{record.email} </Link>
            }
        },

        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <a onClick={() => this.doDelete(record)}><FiUserMinus/></a>

            ),
        },
    ]

    constructor(props) {
        super(props)

        this.state = {
            listGroups: []
        }

    }

    componentDidMount() {
        const challenge_id = this.props.challenge;
        this.props.forceFetchGroup(challenge_id)

    }


    doDelete(record) {
        const _this = this;
        confirm({
            title: 'Voulez vous vraiment supprimer cet étudiant ?',
            content: record.email + ' ne serra plus dans ce groupe!',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                _this.props.forceRemoveGroup(record.id)
            },
            onCancel() {
            },
        });
    }

    render() {
        return <div style={{
            margin: '0px 16px',
        }}>
            <h4 className="text-center">Liste des groupes</h4>

            {this.iterateGroup()}
        </div>
    }

    iterateGroup() {
        let groups = {};
        this.props.listGroup.forEach(function (item) {

            let list = groups[item.group_id];
            if (list) {
                list.push(item);
            } else {
                groups[item.group_id] = [item];
            }
        });
        const array = Object.values(groups)

        return array.length > 0 ?
            array.map(group => {
                let array = [];
                group.map((user, index) => {
                    user.key = index
                    array.push(user)
                });
                return (
                    <Row>
                        <Col>
                            <Collapse
                                bordered={false}
                                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                <Collapse.Panel header={"Groupe: "+array[0].group_id} key="1" style={customPanelStyle}>
                                  <Table
                                columns={this.column}
                                dataSource={array}
                                size="small"
                                footer={() => (
                                    <Link
                                        to={"/group/force_add_to_group/" + this.props.challenge + "/" + array[0].group_id}>Add
                                        new member </Link>)
                                }
                            />
                                </Collapse.Panel>

                              </Collapse>


                        </Col>
                    </Row>

                )
            }) :
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>


    }
}

const customPanelStyle = {
  borderRadius: 4,

  border: 0,
  overflow: 'hidden',
};

const mapStateToProps = (state) => {
    return {
        listGroup: state.group.listGroup,
        auth: state.auth
    }

};

export default connect(
    mapStateToProps,
    {createMessage, forceRemoveGroup, forceFetchGroup}
)(TableGroup);
