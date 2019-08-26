import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import TopoInfoRow from '../../TopoInfoRow/topoInfoRow';



const switchInfo = (props) => {

    // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk: ",props.nodeInfo)
    return (
        <>
        <Container className="customBorder1" fluid style={{backgroundColor: "white"}}>
            <Row className="border">
                <Col sm="12" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Selected Node Information
                    </div>
                </Col>
            </Row>

            <TopoInfoRow name="Type" value={props.nodeInfo.switchType}/>
            <TopoInfoRow name="ID" value={props.nodeInfo.id}/>
          
        </Container>

        <Container className="customBorder1 mt-3" fluid style={{backgroundColor: "white"}}>
            <Row className="border">
                {/* <Col sm="12" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Switch's ports IDs
                    </div>
                </Col> */}
                <Col sm="12" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Switch's ports
                    </div>
                </Col>
            </Row>
            <Row className="border">
                <Col sm="4" className="font-weight-bold d-flex justify-content-center border-right">
                    <div>
                        IDs
                    </div>
                </Col>
                <Col sm="8" className="font-weight-bold d-flex justify-content-center">
                    <div>
                        Destination
                    </div>
                </Col>
            </Row>

            {
                Object.keys(props.nodeInfo.connectors).map((portId, i) => (
                    <Row className="border" key={portId}>
                        {/* <Col sm="3"> </Col> */}
                        <Col sm="4" className="font-weight-bold d-flex justify-content-start border-right">
                            <div>
                                <Button 
                                    className="p-0" 
                                    color="link"
                                    onClick={()=>props.switchPortClickedHandler(portId)}
                                >
                                    {portId}
                                </Button>
                            </div>
                        </Col>

                        <Col sm="8" className="font-weight-bold d-flex justify-content-start">
                            <div>
                                <Button 
                                    className="p-0" 
                                    color="black"
                                >
                                    { props.filteredLinks[portId] ? props.filteredLinks[portId].nodeId : 'Local'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                ))
            }

        </Container>
        </>
    );
}


export default switchInfo;