import React, { useEffect, useState } from 'react';
import IphoneProduct from 'components/IphoneProduct';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Select, Empty, Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ButtonBack from 'components/ButtonBack';
import getIphoneLayout from 'utils/getIphoneLayout';
import Ship from 'assets/images/ship.png';
import {
  setAllDevices,
  approveIPhone,
  setIPhoneAllowance,
  setIPhoneBal,
  buyDevice,
} from 'store/actions';

import './style.scss';

const { Option } = Select;

export default function BuyIphone() {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const allDevices = useSelector((state) => state.allDevices);
  const iPhoneAllowance = useSelector((state) => state.iPhoneAllowance);
  const iPhoneBal = useSelector((state) => state.iPhoneBal);
  const loading = useSelector((state) => state.loading);
  const [currentPhone, setCurrentPhone] = useState(null);
  const [modelSelling, setModelSelling] = useState([]);
  const [listColorModel, setListColorModel] = useState([]);
  const dispatch = useDispatch();
  let isApproved = iPhoneAllowance > 0;
  useEffect(() => {
    dispatch(setAllDevices());
    dispatch(setIPhoneAllowance());
    dispatch(setIPhoneBal());
  }, [dispatch]);
  /* eslint-disable react-hooks/exhaustive-deps*/
  useEffect(() => {
    if (allDevices.length > 0) {
      if (!currentPhone) {
        setCurrentPhone(allDevices[allDevices.length - 1]);
        updateCurrent(allDevices[allDevices.length - 1].model);
      }

      let arryModel = [];
      allDevices.forEach((phone) => {
        if (!arryModel.includes(phone.model)) {
          arryModel.push(phone.model);
        }
      });
      setModelSelling(arryModel);
    } else {
      setCurrentPhone(null);
    }
  }, [allDevices]);

  /* eslint-disable react-hooks/exhaustive-deps*/
  useEffect(() => {
    if (currentPhone && listColorModel.length <= 0) {
      updateCurrent(currentPhone.model);
    }
  }, [currentPhone]);

  const handleApproveIPhone = (id) => {
    dispatch(approveIPhone());
  };

  const handleBuyDevice = (id, price) => {
    if (parseInt(iPhoneBal) < parseInt(price)) {
      alert('insufficient IPHONE token');
    } else {
      dispatch(buyDevice(id));
    }
  };

  const updateCurrent = (value) => {
    let listColor = [];
    let arrDevices = allDevices.filter((phone) => phone.model === value);
    arrDevices.forEach((device) => {
      if (!listColor.includes(device.color)) {
        listColor.push({
          color: device.color,
          code: getIphoneLayout(value, device.color).codeColor,
        });
      }
    });
    setCurrentPhone(arrDevices[0]);
    setListColorModel(listColor);
  };

  const filterOption = (input, option) => {
    return option.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const changeCurrentPhone = (model, color) => {
    let modelsDevice = allDevices.filter((phone) => phone.model === model);
    modelsDevice.forEach((device, index) => {
      if (device.model === model && device.color === color) {
        setCurrentPhone(modelsDevice[index]);
      }
    });
  };

  return (
    <div className='styleStake flex_justify_content'>
      <div className='phone_header flex_between'>
        <div className='w32px'>
          <ButtonBack url='/home?preset=moveToRightFromLeft' />
        </div>
        <p>Choose your model</p>
        <div className='w32px' />
      </div>
      <div className='buy_iphone_body '>
        <div className='product_info'>
          <Spin
            indicator={antIcon}
            spinning={loading && currentPhone === null}
            className='spin-center-screen'
          >
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder='Select type iPhone'
              optionFilterProp='children'
              onChange={updateCurrent}
              filterOption={filterOption}
              value={`iPhone ${currentPhone !== null ? currentPhone.model : ''}`}
            >
              {modelSelling.map((model, index) => {
                return (
                  <Option value={model} key={index}>
                    iPhone {model}
                  </Option>
                );
              })}
            </Select>
            {!loading && allDevices.length <= 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description='No device'
                className='stye-empty-box'
              />
            ) : null}
            {currentPhone && currentPhone.id > 0 ? (
              <div>
                <IphoneProduct
                  listColorModel={listColorModel}
                  iPhone={currentPhone}
                  changeCurrentPhone={(model, color) => changeCurrentPhone(model, color)}
                  loading={loading}
                />
              </div>
            ) : (
              ''
            )}
          </Spin>
        </div>
        {currentPhone && currentPhone.id > 0 ? (
          isApproved ? (
            <Button
              className='product_bt bt-liner'
              onClick={() => handleBuyDevice(currentPhone.id, currentPhone.price)}
              disabled={!isApproved}
              loading={loading}
            >
              Buy
            </Button>
          ) : (
            <Button
              className='product_bt bt-liner'
              onClick={() => handleApproveIPhone(currentPhone.id)}
              loading={loading}
            >
              Approve IPHONE
            </Button>
          )
        ) : (
          ''
        )}
        <div className='col'>
          <img className='ship_image ' src={Ship} alt='ship' />
        </div>
      </div>
    </div>
  );
}
