


// ...existing code...
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, message, Form } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import legalServicesData from '../../data/legalServicesData';
import nonLegalServicesData from '../../data/nonLegalServicesData';
// ...existing code...
// Removed all truly unused variables and functions for a clean, warning-free file
// ...existing code...
const ConfirmBookingModal = ({ visible, onCancel, bookingData, onConfirm, paymentMethod: paymentMethodProp }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodProp || 'cash');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [paymentCode, setPaymentCode] = useState('');
  const [showPDFOption, setShowPDFOption] = useState(false);
  const [isPDFConfirmStep, setIsPDFConfirmStep] = useState(false); // Thêm state mới
  const [finalBookingData, setFinalBookingData] = useState(null); // Lưu data tạm thời
  const [isProcessingSignature, setIsProcessingSignature] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false); // Thêm state cho việc xử lý thanh toán
  const [isRedirectingToVNPAY, setIsRedirectingToVNPAY] = useState(false); // Thêm state cho việc chuyển hướng VNPAY
  const signatureRef = useRef();

  // Luôn gọi useEffect ở đầu component
  useEffect(() => {
    if (visible && paymentMethodProp) {
      setPaymentMethod(paymentMethodProp);
      
      // Flow mới: luôn bắt đầu từ step 1 (xác nhận thông tin)
      // cho tất cả các loại thanh toán
      setCurrentStep(1);
    }
  }, [visible, paymentMethodProp]);

  if (!bookingData) return null;

  // Helper: format currency
  const formatCurrency = (amount) => amount ? `${Number(amount).toLocaleString()} đ` : '0 đ';

  // Helper: get address
  const getCollectionAddress = () => {
    if (bookingData.collectionMethod?.name === 'At Home') {
      return bookingData.homeAddress || '—';
    }
    return '7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City';
  };

  // Helper: get express service
  const getExpressService = () => bookingData.isExpressService ? 'Có' : 'Không';

  // Helper: get mediation method label
  const getMediationLabel = (method) => {
    if (method === 'postal-delivery') return 'Postal Delivery';
    if (method === 'staff-collection') return 'Staff Collection';
    if (method === 'walk-in') return 'Walk-in Service';
    if (method === 'express') return 'Express Service';
    return method;
  };

  // Helper: get payment label
  const getPaymentLabel = (method) => {
    if (method === 'cash') return 'Thanh toán tiền mặt khi nhận dịch vụ';
    if (method === 'vnpay') return 'Thanh toán qua VNPAY';
    return method;
  };

  // Helper: get cost breakdown
  const getCostBreakdown = () => {
    const { service, selectedMedicationMethod, isExpressService, selectedCollectionMethod } = bookingData;
    
    // Phí cơ bản của dịch vụ
    let serviceCost = service?.basePrice || 0;
    
    // Phí thu mẫu - đảm bảo hiển thị chính xác giá của Collection Method
    let collectionCost = 0;
    // Khi chọn express service, collection method luôn miễn phí (0 đồng)
    if (!isExpressService) {
      collectionCost = selectedCollectionMethod?.price || 0;
    }
    console.log('PDF - Collection Method:', selectedCollectionMethod);
    console.log('PDF - Collection Cost (after express check):', collectionCost);
    console.log('PDF - Express Service:', isExpressService);
    
    // Phí vận chuyển
    let mediationCost = 0;
    
    // Tính phí vận chuyển theo phương thức
    if (selectedMedicationMethod === 'staff-collection') {
      mediationCost = isExpressService ? 0 : 500000; // Miễn phí nếu đã chọn express service
    } else if (selectedMedicationMethod === 'postal-delivery') {
      mediationCost = isExpressService ? 0 : 250000; // Miễn phí nếu đã chọn express service
    } else if (selectedMedicationMethod === 'express') {
      mediationCost = isExpressService ? 0 : 700000; // Miễn phí nếu đã chọn express service
    }
    
    // Phí express
    let expressCost = 0;
    if (isExpressService) {
      expressCost = service?.expressPrice || 1500000;
      // Khi chọn express service, collection method luôn miễn phí (0 đồng)
      collectionCost = 0;
    }
    
    // Log để debug
    console.log('PDF - Tổng chi phí:', {
      serviceCost,
      collectionCost,
      mediationCost,
      expressCost,
      total: serviceCost + collectionCost + mediationCost + expressCost
    });
    
    return { serviceCost, collectionCost, mediationCost, expressCost };
  };

  // Payment code & QR
  const generatePaymentCode = () => `DNA${Date.now().toString().slice(-6)}`;
  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  // Step 1: Confirm info
  const handleEdit = () => {
    setCurrentStep(1);
    onCancel();
  };
  
  const handleConfirm = async () => {
    Modal.confirm({
      title: 'Bạn có chắc những thông tin này là đúng không?',
      okText: 'Có',
      cancelText: 'Không',
      centered: true,
      width: 480,
      style: { maxWidth: 600 },
      onOk: async () => {
        const code = generatePaymentCode();
        setPaymentCode(code);
        
        // Flow mới: Với tất cả các loại thanh toán đều chuyển đến step 2 (ký tên)
        setCurrentStep(2);
      }
    });
  };

  // Hàm kiểm tra chất lượng chữ ký (ít strict hơn)
  const validateSignatureQuality = (signatureData) => {
    // Chỉ kiểm tra cơ bản - chữ ký có dữ liệu không
    if (signatureData.length < 1000) {
      return false;
    }
    
    return true;
  };



  // Step 3: Signature (cho cả cash và VNPAY)
  const handleSignatureComplete = async () => {
    // Kiểm tra chữ ký có tồn tại và không trống
    if (!signatureRef.current) {
      message.error('Không tìm thấy vùng ký tên!');
      return;
    }
    
    if (signatureRef.current.isEmpty()) {
      message.error('Vui lòng ký tên trước khi tiếp tục!');
      return;
    }
    
    setIsProcessingSignature(true);
    
    try {
      const signatureData = signatureRef.current.toDataURL('image/png');
      
      // Kiểm tra chữ ký có dữ liệu hợp lệ
      if (!signatureData || signatureData.length < 100) {
        message.error('Chữ ký không hợp lệ. Vui lòng ký lại!');
        return;
      }
      
      // Kiểm tra chất lượng chữ ký (tùy chọn - có thể bỏ qua nếu quá strict)
      if (!validateSignatureQuality(signatureData)) {
        message.error('Chữ ký quá đơn giản hoặc không rõ ràng. Vui lòng ký lại!');
        return;
      }
      
      // Tạo signatureId local thay vì gọi server
      const signatureId = `sig_${paymentCode}_${Date.now()}`;
      
      const bookingDataWithSignature = {
        ...bookingData,
        paymentMethod,
        paymentCode,
        signature: signatureData,
        signatureId: signatureId, // ID local của chữ ký
        status: 'signed',
        signedAt: new Date().toISOString()
      };
      
      // Lưu data tạm thời
      setFinalBookingData(bookingDataWithSignature);
      
      // Flow mới: Sau ký tên, tất cả payment method đều chuyển sang PDF option
      setIsPDFConfirmStep(true);
      setShowPDFOption(true);
      
      message.success('Ký tên thành công!');
      
    } catch (error) {
      console.error('Error processing signature:', error);
      message.error('Có lỗi xảy ra khi xử lý chữ ký. Vui lòng thử lại!');
    } finally {
      setIsProcessingSignature(false);
    }
  };

  // Hàm xử lý thanh toán VNPAY (được gọi sau khi ký tên và tùy chọn PDF)
  const handleVNPAYPayment = async () => {
    let processingMsg = null;
    
    try {
      setIsSubmittingPayment(true);
      setIsRedirectingToVNPAY(true);
      
      // Hiển thị thông báo đang xử lý với delay để người dùng thấy được
      processingMsg = message.loading('Đang xử lý thanh toán VNPAY, vui lòng đợi giây lát...', 0);
      
      // Delay một chút để người dùng thấy thông báo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Lưu đơn hàng tạm thời vào localStorage để sau này lấy lại
      const tempBookingData = {
        ...finalBookingData,
        paymentMethod,
        paymentCode,
        status: 'pending_payment'
      };
      
      // Lưu thông tin đơn hàng vào localStorage
      const pendingBookings = JSON.parse(localStorage.getItem('pending_vnpay_bookings') || '[]');
      pendingBookings.push(tempBookingData);
      localStorage.setItem('pending_vnpay_bookings', JSON.stringify(pendingBookings));
      
      // Chuẩn bị payload theo đúng cấu trúc API
      // Xử lý ngày sinh của người thứ nhất cho LocalDate
      let firstPersonBirthDate;
      if (bookingData.firstPerson?.dateOfBirth) {
        if (typeof bookingData.firstPerson.dateOfBirth === 'object' && bookingData.firstPerson.dateOfBirth.format) {
          // Format cho LocalDate: yyyy-MM-dd
          firstPersonBirthDate = bookingData.firstPerson.dateOfBirth.format('YYYY-MM-DD');
        } else {
          firstPersonBirthDate = bookingData.firstPerson.dateOfBirth;
        }
      } else {
        firstPersonBirthDate = "";
      }
      
      // Xử lý ngày sinh của người thứ hai cho LocalDate
      let secondPersonBirthDate;
      if (bookingData.secondPerson?.dateOfBirth) {
        if (typeof bookingData.secondPerson.dateOfBirth === 'object' && bookingData.secondPerson.dateOfBirth.format) {
          // Format cho LocalDate: yyyy-MM-dd
          secondPersonBirthDate = bookingData.secondPerson.dateOfBirth.format('YYYY-MM-DD');
        } else {
          secondPersonBirthDate = bookingData.secondPerson.dateOfBirth;
        }
      } else {
        secondPersonBirthDate = "";
      }
      
      // Chuyển đổi dữ liệu người dùng thành định dạng testSubjects
      const testSubjects = [
        // Người thứ nhất
        {
          fullname: bookingData.firstPerson?.fullName || "",
          dateOfBirth: firstPersonBirthDate,
          gender: bookingData.firstPerson?.gender === 'male' ? 1 : 2,
          phone: bookingData.firstPerson?.phoneNumber || "",
          email: bookingData.firstPerson?.email || "",
          relationship: bookingData.firstPerson?.relationship || "",
          sampleType: bookingData.firstPerson?.sampleType || "",
          idNumber: bookingData.firstPerson?.personalId || ""
        }
      ];
      
      // Thêm người thứ hai nếu có thông tin đầy đủ
      if (bookingData.secondPerson && bookingData.secondPerson.fullName) {
        testSubjects.push({
          fullname: bookingData.secondPerson.fullName,
          dateOfBirth: secondPersonBirthDate,
          gender: bookingData.secondPerson.gender === 'male' ? 1 : 2,
          phone: bookingData.secondPerson.phoneNumber || "",
          email: bookingData.secondPerson.email || "",
          relationship: bookingData.secondPerson.relationship || "",
          sampleType: bookingData.secondPerson.sampleType || "",
          idNumber: bookingData.secondPerson.personalId || ""
        });
      }
      
      // Đảm bảo định dạng ngày tháng đúng theo yêu cầu của API (LocalDate)
      let appointmentTime = bookingData.appointmentDate;
      if (typeof appointmentTime === 'object' && appointmentTime.format) {
        appointmentTime = appointmentTime.format('YYYY-MM-DD');
      }
      
      // Tạo payload theo format API đã thành công
      const payload = {
        bookingID: null,
        collectionMethod: bookingData.collectionMethod?.name || "At Facility",
        paymentMethod: paymentMethod,
        appointmentTime: appointmentTime,
        timeRange: bookingData.timeSlot || "",
        status: "pending_payment",
        note: "",
        cost: 0,
        mediationMethod: bookingData.medicationMethod || "",
        additionalCost: 0,
        totalCost: bookingData.totalCost || 0,
        expressService: bookingData.isExpressService || false,
        address: bookingData.homeAddress || "",
        kitID: bookingData.selectedKitType || "",
        serviceID: bookingData.service?.serviceID || "",
        customerID: bookingData.customerID || "",
        customerName: bookingData.firstPerson?.fullName || "",
        testSubjects: testSubjects
      };
      
      // Gọi API để tạo đơn hàng và nhận URL thanh toán VNPAY
      const serviceID = bookingData.service?.serviceID || '';
      const customerID = bookingData.customerID || '';
      
      console.log('Gửi yêu cầu thanh toán VNPAY với payload:', payload);
      
      // Sử dụng axios để gọi API
      const response = await axios.post(`/booking/bookings/${serviceID}/${customerID}`, payload);
      const data = response.data;
      
      console.log('Kết quả từ API:', data);
      
      if (data.vnpUrl) {
        console.log('Đã nhận được URL VNPAY, chuyển hướng đến:', data.vnpUrl);
        
        // Đóng thông báo loading hiện tại
        processingMsg();
        
        // Hiển thị thông báo chuyển hướng
        message.success('Tạo thanh toán thành công! Đang chuyển hướng đến VNPAY...', 2);
        
        // Delay để người dùng thấy thông báo và UI loading trước khi chuyển hướng
        setTimeout(() => {
          window.location.href = data.vnpUrl;
        }, 1200);
        
        return; // Dừng xử lý vì người dùng sẽ được chuyển hướng
      } else {
        console.error('Không nhận được vnpUrl từ API:', data);
        processingMsg(); // Đóng loading message
        message.error('Không thể tạo liên kết thanh toán VNPAY. Vui lòng thử lại!');
        setIsSubmittingPayment(false);
        setIsRedirectingToVNPAY(false);
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán VNPAY:', error);
      
      // Đóng loading message
      processingMsg();
      
      // Hiển thị chi tiết lỗi để debug
      if (error.response) {
        console.error('Chi tiết lỗi từ server:', error.response.data);
        console.error('Status code:', error.response.status);
        
        // Xử lý lỗi lazy loading từ Hibernate
        if (typeof error.response.data === 'string' && 
            (error.response.data.includes('lazily initialize') || 
             error.response.data.includes('no Session'))) {
          message.error('Lỗi kết nối dữ liệu từ server. Vui lòng thử lại sau!');
        } else {
          // Hiển thị thông báo lỗi cụ thể từ server
          message.error('Lỗi từ server: ' + (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)));
        }
      } else if (error.request) {
        console.error('Không nhận được phản hồi từ server:', error.request);
        message.error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng!');
      } else {
        console.error('Lỗi cấu hình request:', error.message);
        message.error('Lỗi khi thiết lập yêu cầu: ' + error.message);
      }
      
      setIsSubmittingPayment(false);
      setIsRedirectingToVNPAY(false);
    }
  };

  // Hàm xử lý khi người dùng chọn tải PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Kiểm tra chữ ký trước khi tạo PDF
      if (!finalBookingData?.signature && (!signatureRef.current || signatureRef.current.isEmpty())) {
        message.error('Không tìm thấy chữ ký. Vui lòng ký lại!');
        setIsGeneratingPDF(false);
        return;
      }
      
      // Hiển thị thông báo đang xử lý
      const processingMsg = message.loading('Đang tạo file PDF...', 0);
      
      try {
        // Tạo PDF trực tiếp với tham số shouldDownload là true để tải xuống
        await generatePDF(true);
        
        // Đóng thông báo đang xử lý
        processingMsg();
        
        // Thông báo thành công
        message.success('Tải file PDF thành công!');
        
        // Tiếp tục flow dựa vào payment method
        if (paymentMethod === 'cash') {
          // Cash: Lưu đơn hàng và hoàn tất
          const updatedBookingData = {
            ...finalBookingData,
            pdfGenerated: true,
            pdfGeneratedAt: new Date().toISOString()
          };
          
          onConfirm(updatedBookingData);
          setCurrentStep(4);
          setIsPDFConfirmStep(false);
        } else {
          // VNPAY: Hiển thị thông báo và chuyển đến thanh toán
          // KHÔNG reset isPDFConfirmStep về false để tránh quay lại bước ký tên
          message.info('Đang chuyển sang thanh toán VNPAY...', 1);
          await handleVNPAYPayment();
        }
        
      } catch (pdfError) {
        // Đóng thông báo đang xử lý
        processingMsg();
        console.error('Lỗi khi tạo PDF:', pdfError);
        message.error(`Không thể tạo PDF: ${pdfError.message}. Vui lòng thử lại!`);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      message.error('Có lỗi khi tạo PDF. Vui lòng thử lại!');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Hàm xử lý khi người dùng bỏ qua PDF
  const handleSkipPDF = async () => {
    if (paymentMethod === 'cash') {
      // Cash: Lưu đơn hàng và hoàn tất
      onConfirm(finalBookingData);
      setCurrentStep(4);
      setIsPDFConfirmStep(false);
      setShowPDFOption(false);
    } else {
      // VNPAY: Hiển thị thông báo và chuyển đến thanh toán
      // KHÔNG reset isPDFConfirmStep về false để tránh quay lại bước ký tên
      message.info('Đang chuyển sang thanh toán VNPAY...', 1);
      await handleVNPAYPayment();
    }
  };

// Generate PDF function với jsPDF (An toàn và đơn giản)
const generatePDF = async (shouldDownload = true) => {
  let loadingMessage;
  try {
    console.log('=== BẮT ĐẦU TẠO PDF ===');
    // Hiển thị loading
    loadingMessage = message.loading('Đang tạo file PDF...', 0);
    
    // Kiểm tra dữ liệu cần thiết trước khi tạo PDF
    if (!bookingData) {
      throw new Error('Không có dữ liệu đặt lịch!');
    }

    try {
      // Đảm bảo thư viện pdfmake đã được tải
      console.log('Đang tải thư viện pdfmake...');
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFonts = await import("pdfmake/build/vfs_fonts");
      const pdfMake = pdfMakeModule.default;
      pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
      console.log('Đã tải thành công thư viện pdfmake');
    } catch (error) {
      console.error('Lỗi khi tải thư viện pdfmake:', error);
      throw new Error('Không thể tải thư viện PDF. Vui lòng thử lại!');
    }

    const { firstPerson, secondPerson, appointmentDate, totalCost } = bookingData;

    // Validation dữ liệu bắt buộc với thông báo cụ thể
    if (!firstPerson?.fullName || !secondPerson?.fullName) {
      throw new Error('Thiếu thông tin họ tên');
    }

    if (!appointmentDate) {
      throw new Error('Thiếu thông tin ngày hẹn');
    }

    if (!totalCost || totalCost <= 0) {
      throw new Error('Thông tin chi phí không hợp lệ');
    }

    // Kiểm tra chữ ký trước khi import thư viện
    let signatureImg = "";
    
    // Ưu tiên lấy từ finalBookingData (đã lưu)
    if (finalBookingData?.signature) {
      signatureImg = finalBookingData.signature;
      console.log('✓ Đã lấy chữ ký từ finalBookingData');
    } 
    // Fallback: lấy từ signatureRef hiện tại
    else if (signatureRef.current && !signatureRef.current.isEmpty()) {
      try {
        signatureImg = signatureRef.current.toDataURL("image/png");
        console.log('✓ Đã lấy chữ ký từ signatureRef');
      } catch (sigError) {
        console.error('Lỗi khi lấy chữ ký từ canvas:', sigError);
        throw new Error('Không thể lấy chữ ký từ canvas');
      }
    }
    
    // Kiểm tra chữ ký có dữ liệu hợp lệ
    if (!signatureImg || signatureImg.length < 100) {
      console.error('Lỗi: Chữ ký không hợp lệ');
      throw new Error('Chữ ký không hợp lệ hoặc quá ngắn');
    }

    console.log('Signature length:', signatureImg.length);

    // Thư viện pdfmake đã được tải ở trên

    // Format ngày an toàn
    const formatDate = (d) => {
      try {
        if (!d) return "";
        if (typeof d === "string" && d.includes('/')) return d;
        if (typeof d === "string") {
          const parts = d.split('-');
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
          return d;
        }
        if (d && typeof d.format === 'function') return d.format('DD/MM/YYYY');
        if (d instanceof Date) return d.toLocaleDateString('vi-VN');
        return String(d);
      } catch (dateError) {
        console.warn('Lỗi format ngày:', dateError);
        return "";
      }
    };

    console.log('Bắt đầu tạo docDefinition...');
    
    // Lấy thông tin chi phí từ bookingData
    const { service, isExpressService } = bookingData;
    const { serviceCost, collectionCost, mediationCost, expressCost } = getCostBreakdown();
    
    // Định nghĩa kitTypes
    const kitTypes = [
      { value: 'K001', label: 'PowerPlex Fusion', price: 0 },
      { value: 'K002', label: 'Global Filer', price: 0 }
    ];
    
    // Tạo bảng chi phí động dựa trên các thành phần thực tế
    const costTableBody = [];
    
    // Phí dịch vụ - sử dụng giá trị đầy đủ, không chia đôi
    if (serviceCost > 0) {
      costTableBody.push([
        { text: 'Phí xét nghiệm dịch vụ', alignment: 'left' },
        { text: `${serviceCost.toLocaleString()} VND`, alignment: 'right' }
      ]);
    }
    
    // Phí thu mẫu - luôn hiển thị với giá 0đ nếu Express Service được chọn
    if (bookingData.collectionMethod) {
      // Lấy tên phương thức thu mẫu
      const collectionMethodName = bookingData.collectionMethod?.name || "Phí thu mẫu";
      
      costTableBody.push([
        { text: `Phí thu mẫu (${collectionMethodName})`, alignment: 'left' },
        { 
          text: isExpressService ? 'Miễn phí' : `${collectionCost.toLocaleString()} VND`, 
          alignment: 'right',
          color: isExpressService ? '#52c41a' : undefined
        }
      ]);
    }
    
    // Phí vận chuyển/giao hàng
    const medicationMethod = bookingData.selectedMedicationMethod || bookingData.medicationMethod;
    
    // Hiển thị Staff Collection nếu được chọn
    if (medicationMethod === 'staff-collection') {
      costTableBody.push([
        { text: 'Phí thu mẫu tại nhà (Staff Collection)', alignment: 'left', bold: true },
        { 
          text: isExpressService ? 'Miễn phí' : `500,000 VND`, 
          alignment: 'right', 
          bold: true,
          color: isExpressService ? '#52c41a' : undefined
        }
      ]);
    } 
    
    // Hiển thị Postal Delivery nếu được chọn
    else if (medicationMethod === 'postal-delivery') {
      costTableBody.push([
        { text: 'Phí gửi bưu điện (Postal Delivery)', alignment: 'left', bold: true },
        { 
          text: isExpressService ? 'Miễn phí' : `250,000 VND`, 
          alignment: 'right', 
          bold: true,
          color: isExpressService ? '#52c41a' : undefined
        }
      ]);
    } 
    
    // Hiển thị Express Service nếu được chọn
    else if (medicationMethod === 'express') {
      costTableBody.push([
        { text: 'Phí dịch vụ express (Express Service)', alignment: 'left', bold: true },
        { 
          text: isExpressService ? 'Miễn phí' : `700,000 VND`, 
          alignment: 'right', 
          bold: true,
          color: isExpressService ? '#52c41a' : undefined
        }
      ]);
    }
    
    // Thêm ghi chú về Express Service nếu được chọn
    if (isExpressService) {
      costTableBody.push([
        { 
          text: 'Ghi chú: Khi sử dụng Express Service, tất cả các phương thức vận chuyển đều được miễn phí (0 đồng).', 
          alignment: 'left', 
          colSpan: 2,
          color: '#52c41a',
          fontSize: 10,
          italics: true
        },
        {}
      ]);
    }
    
    // Hiển thị Walk-in Service nếu được chọn
    else if (medicationMethod === 'walk-in') {
      costTableBody.push([
        { text: 'Phí dịch vụ tại cơ sở (Walk-in Service)', alignment: 'left', bold: isExpressService },
        { 
          text: isExpressService ? 'Miễn phí' : `${mediationCost.toLocaleString()} VND`, 
          alignment: 'right',
          color: isExpressService ? '#52c41a' : undefined,
          bold: isExpressService
        }
      ]);
    }
    
    // Hiển thị phí vận chuyển chung nếu có phí nhưng không thuộc các loại trên
    else if (mediationCost > 0 || isExpressService) {
      costTableBody.push([
        { text: 'Phí vận chuyển', alignment: 'left' },
        { 
          text: isExpressService ? 'Miễn phí' : `${mediationCost.toLocaleString()} VND`, 
          alignment: 'right',
          color: isExpressService ? '#52c41a' : undefined
        }
      ]);
    }
    
    // Express service
    if (isExpressService && expressCost > 0) {
      costTableBody.push([
        { text: 'Express Service', alignment: 'left', color: '#fa8c16', bold: true },
        { text: `${expressCost.toLocaleString()} VND`, alignment: 'right', color: '#fa8c16', bold: true }
      ]);
    }
    
    // Tính tổng chi phí chính xác
    const calculatedTotal = serviceCost + collectionCost + mediationCost + expressCost;
    
    // Thêm dòng tổng cộng
    costTableBody.push(
      [
        { text: 'Cộng', bold: true, alignment: 'left' },
        { text: `${calculatedTotal.toLocaleString()} VND`, bold: true, alignment: 'right' }
      ],
      [
        { text: 'Tổng chi phí', bold: true, alignment: 'left' },
        { text: `${calculatedTotal.toLocaleString()} VND`, bold: true, alignment: 'right', color: '#e91e63' }
      ]
    );

    // ⭐ TẠO DOCDEFINITION GIỐNG HANDLEEXPORTPDF
    const docDefinition = {
      content: [
        {
          text: [
            { text: "Đơn yêu cầu xét nghiệm ADN\n", style: "header", alignment: "center" },
            { text: "Kính gửi: Cơ sở Y tế Genetix", alignment: "center" }
          ]
        },
        {
          columns: [
            {
              width: "*",
              text: [
                "Tôi tên là (viết hoa): ",
                { text: (firstPerson?.fullName || "").toUpperCase(), color: "#e91e63", bold: true },
                "    Giới tính: ",
                { text: firstPerson?.gender === "male" ? "Nam" : firstPerson?.gender === "female" ? "Nữ" : firstPerson?.gender || "", bold: true }
              ]
            }
          ]
        },
        {
      text: [
        "Địa chỉ: ",
        { 
          text: bookingData?.collectionMethod?.name === 'At Home' 
            ? (bookingData?.homeAddress || firstPerson?.address || "")
            : "7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City", 
          color: "#e91e63", 
          bold: true 
        },
        "\n"
      ]
    },
        {
          text: [
            "Số CCCD/CMND: ",
            { text: firstPerson?.personalId || "Chưa cung cấp", color: "#e91e63", bold: true },
            "\n"
          ]
        },
        {
          text: [
            "Số điện thoại: ",
            { text: firstPerson?.phoneNumber || "", color: "#e91e63", bold: true },
            "    Email: ",
            { text: firstPerson?.email || "", color: "#e91e63", bold: true },
            "\n"
          ]
        },
        // Thêm thông tin dịch vụ
        {
          text: [
            "Loại dịch vụ: ",
            { text: bookingData.serviceType === 'legal' ? 'Legal DNA Testing' : 'Non-Legal DNA Testing', color: "#2196f3", bold: true },
            "    Tên dịch vụ: ",
            { text: bookingData.service?.name || "", color: "#2196f3", bold: true },
            "\n"
          ]
        },
        {
          text: [
            "Phương thức thu thập: ",
            { text: bookingData.collectionMethod?.name || "", color: "#2196f3", bold: true },
            "    Kit xét nghiệm: ",
            { text: bookingData.selectedKitType ? (kitTypes.find(k => k.value === bookingData.selectedKitType)?.label || bookingData.selectedKitType) : "", color: "#2196f3", bold: true },
            "\n"
          ]
        },
        {
          text: "Đề nghị Genetix phân tích ADN và xác định mối quan hệ huyết thống cho những người cung cấp mẫu dưới đây:",
          margin: [0, 8, 0, 8]
        },
        // Thêm thông tin phương thức vận chuyển/giao hàng
        {
          text: [
            "Phương thức vận chuyển/giao hàng kết quả: ",
            { text: getMediationLabel(bookingData.selectedMedicationMethod || bookingData.medicationMethod), color: "#2196f3", bold: true }
          ],
          margin: [0, 8, 0, 8]
        },
        {
          style: 'tableExample',
          table: {
            widths: [
              "auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"
            ],
            body: [
              [
                { text: "STT", style: "tableHeader" },
                { text: "Họ và tên\n(kí hiệu mẫu)", style: "tableHeader" },
                { text: "Ngày sinh", style: "tableHeader" },
                { text: "Giới tính", style: "tableHeader" },
                { text: "Mối quan hệ", style: "tableHeader" },
                { text: "Loại mẫu", style: "tableHeader" },
                { text: "CCCD/CMND", style: "tableHeader" },
                { text: "Ngày thu mẫu", style: "tableHeader" }
              ],
              [
                "1",
                { text: (firstPerson?.fullName || "").toUpperCase(), color: "#e91e63", bold: true },
                { text: formatDate(firstPerson?.dateOfBirth), color: "#e91e63", bold: true },
                { text: firstPerson?.gender === "male" ? "Nam" : firstPerson?.gender === "female" ? "Nữ" : firstPerson?.gender || "", color: "#e91e63", bold: true },
                { text: firstPerson?.relationship || "", color: "#e91e63", bold: true },
                { text: firstPerson?.sampleType || "", color: "#e91e63", bold: true },
                { text: firstPerson?.personalId || "Chưa cung cấp", color: "#e91e63", bold: true },
                { text: formatDate(appointmentDate), color: "#2196f3", bold: true }
              ],
              [
                "2",
                { text: (secondPerson?.fullName || "").toUpperCase(), color: "#e91e63", bold: true },
                { text: formatDate(secondPerson?.dateOfBirth), color: "#e91e63", bold: true },
                { text: secondPerson?.gender === "male" ? "Nam" : secondPerson?.gender === "female" ? "Nữ" : secondPerson?.gender || "", color: "#e91e63", bold: true },
                { text: secondPerson?.relationship || "", color: "#e91e63", bold: true },
                { text: secondPerson?.sampleType || "", color: "#e91e63", bold: true },
                { text: secondPerson?.personalId || "", color: "#e91e63", bold: true },
                { text: formatDate(appointmentDate), color: "#2196f3", bold: true }
              ]
            ]
          },
          layout: {
            hLineWidth: function() { return 1; },
            vLineWidth: function() { return 1; },
            hLineColor: function() { return '#bdbdbd'; },
            vLineColor: function() { return '#bdbdbd'; },
            paddingLeft: function() { return 4; },
            paddingRight: function() { return 4; },
            paddingTop: function() { return 2; },
            paddingBottom: function() { return 2; }
          }
        },
        
        // ===== THÊM PHẦN CAM KẾT =====
        {
          text: "Tôi xin cam kết:",
          style: "commitmentHeader",
          bold: true,
          color: "#000000",
          margin: [0, 15, 0, 8]
        },
        {
          ol: [
            {
              text: "Tôi tự nguyện đề nghị xét nghiệm ADN và chấp nhận chi phí xét nghiệm.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Những thông tin tôi đã khai trên đây là đúng sự thật và không thay đổi.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Tôi không để người nhà, người quen đến phiền nhiễu, làm mất trật tự.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Những trường hợp sinh đôi, người ghép tủy, nhận máu, nếu không khai báo trung thực sẽ bị phạt gấp 2 lần lệ phí đã nộp.",
              margin: [0, 0, 0, 4]
            },
            {
              text: "Tôi đã đọc và chấp nhận các điều khoản của Viện tại trang 2 và trang 3 của đơn này và tôi đồng ý để Genetix thực hiện các phân tích ADN với các mẫu trên. Nếu vi phạm, tôi xin chịu hoàn toàn trách nhiệm trước pháp luật.",
              margin: [0, 0, 0, 4]
            }
          ],
          margin: [20, 0, 20, 15]
        },
        
        // ===== Bảng tổng chi phí =====
        {
          table: {
            widths: ['*', 'auto'],
            body: costTableBody
          },
          layout: {
            hLineWidth: function(i, node) {
              // Đường gạch đậm cho dòng "Cộng" và "Tổng chi phí"
              return (i === node.table.body.length - 2 || i === node.table.body.length - 1) ? 1.5 : 1;
            },
            vLineWidth: function() { return 0; },
            hLineColor: function() { return '#bdbdbd'; },
            paddingLeft: function() { return 4; },
            paddingRight: function() { return 4; },
            paddingTop: function() { return 3; },
            paddingBottom: function() { return 3; }
          },
          margin: [0, 10, 0, 0]
        },
        // ===== Phần ký tên, căn phải, có hình ảnh chữ ký =====
        {
          columns: [
            { 
              width: '*', 
              stack: []
            },
            {
              width: 220,
              stack: [
                { text: `Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`, alignment: "center", italics: true, margin: [0, 0, 0, 20] },
                { text: "Người làm đơn", alignment: "center", italics: true },
                // Hình chữ ký (nếu có)
                signatureImg
                  ? { image: signatureImg, width: 120, alignment: "center", margin: [0, 10, 0, 0] }
                  : { text: "(Chưa ký)", alignment: "center", margin: [0, 20, 0, 0] },
                {
                  text: "(Ký và ghi rõ họ tên)\nNgười yêu cầu phân tích",
                  alignment: "center",
                  margin: [0, 10, 0, 0]
                }
              ]
            }
          ],
          margin: [0, 40, 0, 0]
        },
        
        // ===== TRANG 2: ĐIỀU KHOẢN DỊCH VỤ (PHẦN 1) =====
        { text: '', pageBreak: 'before' }, // Tạo trang mới
        {
          text: 'ĐIỀU KHOẢN DỊCH VỤ XÉT NGHIỆM ADN - GENETIX',
          style: 'termsHeader',
          alignment: 'center',
          margin: [0, 20, 0, 25]
        },
        {
          ol: [
            {
              text: 'Trung tâm cơ sở y tế xét nghiệm huyết thống DNA Genetix được Bộ Khoa Học và Công Nghệ cấp chứng nhận đăng ký hoạt động khoa học công nghệ số A-1889.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Người yêu cầu xét nghiệm phải là người không chịu sự quản thúc của pháp luật, có đầy đủ hành vi năng lực để thực hiện yêu cầu xét nghiệm cũng như tự chịu trách nhiệm về việc yêu cầu xét nghiệm của mình, sau đây gọi chung là "khách hàng".',
              margin: [0, 0, 0, 8]
            },
            {
              text: '\'Mẫu\', \'mẫu ADN\' hay "mẫu xét nghiệm quan hệ huyết thống cha-con, mẹ-con hoặc các mối quan hệ huyết thống khác" là các mẫu sinh học (máu, tế bào niêm mạc miệng, móng, tóc...) được lấy trực tiếp từ các bộ phận trên cơ thể của những người cần thực hiện phân tích mối quan hệ huyết thống và phải được lấy theo đúng quy trình thu mẫu của Viện.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Tất cả các mẫu xét nghiệm ADN phải được đựng riêng biệt vào các phong bì hay túi chứa mẫu và được ghi đầy đủ thông tin trùng khớp với thông tin trên Đơn yêu cầu xét nghiệm ADN. Viện sẽ sử dụng các thông tin này cho việc trả kết quả và không chịu trách nhiệm về độ chính xác của các thông tin mà "khách hàng" cung cấp. Các mẫu gửi đến Viện để xét nghiệm ADN không có đầy đủ thông tin ghi trên phong bì đựng mẫu và trên Đơn yêu cầu xét nghiệm ADN thì Viện có quyền hủy bỏ và không bảo lưu.',
              margin: [0, 0, 0, 8]
            },
            {
              text: '"Khách hàng" phải đảm bảo rằng các mẫu cần xét nghiệm ADN cung cấp cho Viện là hợp pháp (không có sự cưỡng chế hay sai phạm gì khi thu hoặc lấy mẫu); "Khách hàng" phải chấp nhận bồi thường cho bất kỳ tổn thất hoặc thiệt hại mà Viện phải chịu khi các mẫu có được không hợp pháp. Trừ trường hợp lấy mẫu bắt buộc khi có sự chỉ định của tòa án (trường hợp này phải tuân thủ theo đúng trình tự và thủ tục tố tụng của pháp luật, đồng thời được sự chấp thuận của Viện).',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Viện sẽ chỉ tiến hành xét nghiệm ADN khi "Đơn yêu cầu xét nghiệm ADN" có đầy đủ các thông tin cùng chữ ký của "khách hàng" yêu cầu xét nghiệm và nhận được thanh toán đủ số tiền chi phí tương ứng với yêu cầu dịch vụ xét nghiệm. Viện có quyền giữ lại các kết quả phân tích cho đến khi khách hàng thanh toán đủ tiền.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Khách hàng phải chịu mọi chi phí phát sinh trong quá trình chuyển phí xét nghiệm và mẫu tới Viện.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Khách hàng cam kết về thông tin khai trong tờ khai này là đúng sự thật và không được thay đổi. Những trường hợp sinh đôi, người ghép tủy, nhận máu, nếu không khai báo trung thực sẽ bị phạt gấp 2 lần lệ phí đã nộp.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Viện có trách nhiệm đảm bảo thời gian trả kết quả xét nghiệm theo đúng yêu cầu dịch vụ, nhưng không chấp nhận bất kỳ trách nhiệm nào về sự chậm trễ bị gây ra bởi một bên thứ ba.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Viện sẽ chỉ thông báo kết quả xét nghiệm cho người đã cung cấp các mẫu và hoàn thành biểu mẫu Đơn yêu cầu xét nghiệm ADN cùng chữ ký (hoặc đại diện hợp pháp). Kết quả xét nghiệm được trả cho khách hàng bằng các hình thức sau: Email, lấy trực tiếp hoặc xem kết quả trực tuyến.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Trường hợp kết luận trong kết quả xét nghiệm ADN của Viện được xác định là chưa chính xác bởi cơ quan hoặc đơn vị có thẩm quyền, Viện sẽ bồi thường gấp 3 lần số tiền mà khách hàng đã đóng đối với xét nghiệm đó. Các yêu cầu bồi thường sẽ không được chấp nhận khi đơn khiếu nại được gửi đến sau 06 tháng kể từ khi có kết quả.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Trường hợp xét nghiệm ADN tự nguyện – dân sự (mẫu do khách hàng tự cung cấp) kết quả xét nghiệm ADN chỉ có giá trị trên mẫu đó và không có giá trị pháp lý.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Mọi thắc mắc chỉ được giải quyết trong vòng 03 tháng kể từ ngày phát hành kết quả.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Kết quả xét nghiệm có thể sử dụng cho mục đích nghiên cứu khoa học.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Thông tin khách hàng được bảo mật, chỉ có người đứng tên xét nghiệm (hoặc người được ủy quyền) mới được trả kết quả. Chúng tôi cam kết không tiết lộ bất kỳ thông tin cá nhân cũng như kết quả của khách hàng cho bên thứ ba, trừ trường hợp có yêu cầu của cơ quan có thẩm quyền.',
              margin: [0, 0, 0, 8]
            },
            {
              text: 'Kết quả xét nghiệm ADN có thể bị ảnh hưởng trong các trường hợp những người bố giả định có quan hệ huyết thống họ hàng.',
              margin: [0, 0, 0, 8]
            }
          ],
          margin: [20, 0, 20, 20]
        },
        // Thêm phần xác nhận đọc và đồng ý điều khoản
        {
          text: 'NGƯỜI YÊU CẦU PHÂN TÍCH ĐÃ ĐỌC KỸ VÀ ĐỒNG Ý VỚI CÁC ĐIỀU KHOẢN TRÊN',
          alignment: 'center',
          bold: true,
          margin: [0, 20, 0, 10]
        },
        {
          text: '(Ký và ghi rõ họ tên)',
          alignment: 'center',
          italics: true,
          margin: [0, 0, 0, 15]
        },
        // Thêm chữ ký vào phần xác nhận điều khoản
        {
          alignment: 'center',
          image: signatureImg,
          width: 150,
          margin: [0, 0, 0, 0]
        }
      ],
      styles: {
        header: { fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
        termsHeader: { fontSize: 14, bold: true, color: '#1976d2' }, // Thêm style cho tiêu đề điều khoản
        tableHeader: { fillColor: "#1976d2", color: "white", bold: true, alignment: "center" },
        tableExample: { margin: [0, 5, 0, 15] },
        legalHeader: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        pageNumber: { fontSize: 9, italics: true }
      },
      defaultStyle: { font: "Roboto", fontSize: 10, lineHeight: 1.3 }, // Giảm font size cho điều khoản
      
      // Thêm số trang ở góc phải phía dưới
      footer: function(currentPage, pageCount) {
        return {
          text: currentPage.toString() + '/' + pageCount,
          alignment: 'right',
          style: 'pageNumber',
          margin: [0, 0, 40, 10]
        };
      }
    };
    
    // Thêm trang 4 cho legal DNA testing
    const imageURL = "data:image/jpeg;base64,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";
    console.log('Service Type:', bookingData.serviceType);
    if (bookingData.serviceType === 'legal') {
      console.log('Adding legal DNA testing page to PDF');
      // Lấy ngày hiện tại cho biên bản
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      
      // Địa chỉ lấy mẫu
      const sampleAddress = bookingData?.collectionMethod?.name === 'At Home' 
        ? (bookingData?.homeAddress || "")
        : "7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City";
      
      // Thêm trang biên bản lấy mẫu xét nghiệm cho legal DNA testing
      docDefinition.content.push(
        { text: '', pageBreak: 'before' }, // Tạo trang mới
        {
          text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
          style: 'legalHeader',
          alignment: 'center'
        },
        {
          text: 'Độc lập – Tự do – Hạnh phúc',
          style: 'legalHeader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: 'BIÊN BẢN LẤY MẪU XÉT NGHIỆM',
          style: 'legalHeader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: [
            `Hôm nay, ngày ${day} tháng ${month} năm ${year}, tại `,
            { text: sampleAddress, bold: true }
          ],
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Chúng tôi gồm có:',
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Trung tâm cơ sở y tế dịch vụ xét nghiệm huyết thống ADN GENETIX',
          margin: [0, 0, 0, 10]
        },
        {
          text: [
            'Người yêu cầu xét nghiệm: ',
            { text: firstPerson?.fullName || "", bold: true },
            '   Địa chỉ thu mẫu: ',
            { text: sampleAddress, bold: true }
          ],
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Chúng tôi tiến hành lấy mẫu của những người đề nghị xét nghiệm ADN. Các mẫu của từng người được lấy riêng rẽ như sau:',
          margin: [0, 0, 0, 20]
        },
        // Thông tin người thứ nhất
        {
          text: [
            'Họ và tên: ',
            { text: firstPerson?.fullName || "", bold: true },
            '                Ngày sinh: ',
            { text: formatDate(firstPerson?.dateOfBirth) || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'CCCD: ',
            { text: firstPerson?.personalId || "", bold: true },
            '            Loại mẫu: ',
            { text: firstPerson?.sampleType || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'Mối quan hệ: ',
            { text: firstPerson?.relationship || "", bold: true }
          ],
          margin: [0, 0, 0, 20]
        },
        // Thông tin người thứ hai
        {
          text: [
            'Họ và tên: ',
            { text: secondPerson?.fullName || "", bold: true },
            '               Ngày sinh: ',
            { text: formatDate(secondPerson?.dateOfBirth) || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'CCCD (nếu có): ',
            { text: secondPerson?.personalId || "", bold: true },
            '            Loại mẫu: ',
            { text: secondPerson?.sampleType || "", bold: true }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          text: [
            'Mối quan hệ: ',
            { text: secondPerson?.relationship || "", bold: true }
          ],
          margin: [0, 0, 0, 40]
        },
                 // Phần ký tên
         {
           columns: [
             {
               width: '*',
               stack: [
                 { text: 'Viện xét nghiệm ADN Genetix\n', alignment: 'center', bold: true },
                 { 
                   image: imageURL,
                   width: 100,
                   alignment: 'center',
                   margin: [0, 5, 0, 5]
                 }
               ]
             },
             {
               width: '*',
               stack: [
                 { text: 'Người yêu cầu xét nghiệm\n', alignment: 'center', bold: true },
                 // Thêm chữ ký vào biên bản
                 signatureImg
                   ? { image: signatureImg, width: 100, alignment: "center", margin: [0, 10, 0, 5] }
                   : { text: "(Chưa ký)", alignment: "center", margin: [0, 10, 0, 5] },
                 { text: '(Ký và ghi rõ họ tên)', alignment: 'center', italics: true }
               ]
             }
           ],
           margin: [0, 0, 0, 20]
         }
      );
    }

    console.log('Bắt đầu tạo PDF...');
    
    try {
      // ⭐ TẠO VÀ DOWNLOAD PDF
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfMake = pdfMakeModule.default;
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      
      // Tạo một Promise để đảm bảo PDF được tạo hoàn toàn trước khi tải xuống
      await new Promise((resolve, reject) => {
        pdfDocGenerator.getBuffer((buffer) => {
          // Nếu có buffer, PDF đã được tạo thành công
          if (buffer) {
            console.log('PDF đã được tạo thành công, kích thước:', buffer.length);
            resolve();
          } else {
            reject(new Error('Không thể tạo buffer PDF'));
          }
        });
      });
      
      // Nếu shouldDownload là true thì tải xuống, ngược lại chỉ tạo PDF mà không tải xuống
      if (shouldDownload) {
        // Tải xuống file PDF
        pdfDocGenerator.download(`DonYeuCauXetNghiemADN_${paymentCode || 'DNA'}.pdf`);
        message.success('Tải file PDF thành công!');
      } else {
        // Tạo PDF nhưng không tải xuống, có thể trả về đối tượng PDF để sử dụng sau này
        message.success('Đã tạo file PDF thành công!');
      }
      
      if (loadingMessage) loadingMessage();
      console.log('✓ PDF đã được tạo thành công');
      
      return pdfDocGenerator; // Trả về đối tượng PDF để có thể sử dụng sau này
    } catch (pdfError) {
      console.error('Lỗi khi tạo hoặc tải xuống PDF:', pdfError);
      throw new Error(`Không thể tạo hoặc tải xuống PDF: ${pdfError.message}`);
    }
    
  } catch (error) {
    console.error('=== LỖI TẠO PDF ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    // Đảm bảo đóng loading message
    if (loadingMessage) loadingMessage();
    
    // Thông báo lỗi chi tiết hơn dựa trên loại lỗi
    if (error.message?.includes('vfs') || error.message?.includes('fonts')) {
      message.error('Lỗi tải fonts PDF. Đang thử lại với fonts mặc định...');
    } else if (error.message?.includes('Timeout')) {
      message.error('Quá thời gian tải thư viện PDF. Vui lòng kiểm tra kết nối mạng!');
    } else if (error.message?.includes('import') || error.message?.includes('loading') || error.message?.includes('thư viện')) {
      message.error('Lỗi tải thư viện PDF. Vui lòng refresh trang và thử lại!');
    } else if (error.message?.includes('chữ ký') || error.message?.includes('signature') || error.message?.includes('canvas')) {
      message.error('Lỗi xử lý chữ ký. Vui lòng ký lại!');
    } else if (error.message?.includes('Thiếu thông tin')) {
      message.error(`Thiếu thông tin cần thiết: ${error.message}`);
    } else {
      message.error(`Có lỗi xảy ra khi tạo file PDF: ${error.message}. Vui lòng thử lại!`);
    }
    
    return null;
  }
};

  // Step 4: Success
  const handleClose = () => {
    // Không cho phép đóng modal khi đang chuyển hướng VNPAY
    if (isRedirectingToVNPAY) {
      message.warning('Vui lòng đợi quá trình chuyển hướng thanh toán hoàn tất!');
      return;
    }
    
    setCurrentStep(1);
    setPaymentMethod('cash');
    setQrCodeData(null);
    setPaymentCode('');
    setShowPDFOption(false);
    // Reset các state mới
    setIsPDFConfirmStep(false);
    setFinalBookingData(null);
    setIsProcessingSignature(false);
    setIsGeneratingPDF(false);
    setIsRedirectingToVNPAY(false);
    if (signatureRef.current && signatureRef.current.clear) signatureRef.current.clear();
    onCancel();
  };

  // Render info summary
  const kitTypes = [
    { value: 'K001', label: 'PowerPlex Fusion', price: 0 },
    { value: 'K002', label: 'Global Filer', price: 0 }
  ];

  const renderSummary = () => {
    const { serviceType, service, collectionMethod, medicationMethod, appointmentDate, timeSlot, isExpressService, totalCost, firstPerson, secondPerson, homeAddress, selectedKitType, bookingTime } = bookingData;
    const { serviceCost, collectionCost, mediationCost, expressCost } = getCostBreakdown();
    
    return (
      <div>
        {/* Header Warning */}
        <Alert
          message={<span style={{ fontWeight: 600 }}>⚠️ Thông tin không thể thay đổi sau khi đặt thành công, vui lòng kiểm tra kỹ!</span>}
          type="warning"
          showIcon
          style={{ 
            marginBottom: 24, 
            borderRadius: 8,
            border: '1px solid #faad14',
            backgroundColor: '#fffbe6'
          }}
        />

        {/* Service Information Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <UserOutlined style={{ color: 'white', fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>Thông tin dịch vụ</span>
            </div>
          }
          style={{ 
            marginBottom: 20, 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e8f4fd'
          }}
          headStyle={{ 
            backgroundColor: '#f8fcff', 
            borderBottom: '1px solid #e8f4fd',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>LOẠI DỊCH VỤ</Text>
                <Text strong style={{ fontSize: 14, color: '#1890ff' }}>
                  {serviceType === 'legal' ? '🏛️ Legal DNA Testing' : '🧬 Non-Legal DNA Testing'}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>TÊN DỊCH VỤ</Text>
                <Text strong style={{ fontSize: 14 }}>{service?.name}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>PHƯƠNG THỨC THU THẬP</Text>
                <Text strong style={{ fontSize: 14 }}>
                  {collectionMethod?.name === 'At Home' ? '🏠 ' : '🏥 '}{collectionMethod?.name}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>KIT XÉT NGHIỆM</Text>
                <Text strong style={{ fontSize: 14 }}>
                  {selectedKitType ? (kitTypes.find(k => k.value === selectedKitType)?.label) : '—'}
                </Text>
              </div>
            </Col>
          </Row>
          
          <Divider style={{ margin: '16px 0' }} />
          
          {/* Address & Transport */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ padding: '12px 16px', backgroundColor: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>📍 ĐỊA CHỈ THU THẬP</Text>
                <Text strong style={{ fontSize: 14, color: '#52c41a' }}>
                  {collectionMethod?.name === 'At Home' ? homeAddress || '—' : '7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City'}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>PHƯƠNG THỨC VẬN CHUYỂN</Text>
                <Text strong style={{ fontSize: 14 }}>
                  {getMediationLabel(medicationMethod || bookingData.selectedMedicationMethod)}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '12px 16px', backgroundColor: isExpressService ? '#fff2e8' : '#fafafa', borderRadius: 8, border: `1px solid ${isExpressService ? '#ffbb96' : '#f0f0f0'}` }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>EXPRESS SERVICE</Text>
                <Text strong style={{ fontSize: 14, color: isExpressService ? '#fa8c16' : '#666' }}>
                  {isExpressService ? '⚡ Có' : '❌ Không'}
                </Text>
              </div>
            </Col>
          </Row>
          
          {/* Appointment */}
          {appointmentDate && (
            <>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ padding: '16px', backgroundColor: '#e6f7ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>📅 LỊCH HẸN</Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                    <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                      {moment(appointmentDate).format('DD/MM/YYYY (dddd)')}
                    </Text>
                  </div>
                  {timeSlot && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: '#f6ffed',
                      padding: '6px 12px',
                      borderRadius: 20,
                      border: '1px solid #b7eb8f'
                    }}>
                      <ClockCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                      <Text strong style={{ color: '#52c41a', fontSize: 14 }}>{timeSlot}</Text>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Customer Information Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#52c41a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <TeamOutlined style={{ color: 'white', fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#52c41a' }}>Thông tin người xét nghiệm</span>
            </div>
          }
          style={{ 
            marginBottom: 20, 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #f6ffed'
          }}
          headStyle={{ 
            backgroundColor: '#f6ffed', 
            borderBottom: '1px solid #d9f7be',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <Row gutter={[16, 16]}>
            {/* Person 1 */}
            <Col span={12}>
              <div style={{ 
                padding: 16, 
                backgroundColor: '#fff', 
                borderRadius: 8, 
                border: '2px solid #1890ff',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: 12,
                  backgroundColor: '#1890ff',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  👤 NGƯỜI ĐẠI DIỆN
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>HỌ VÀ TÊN</Text>
                    <br/>
                    <Text strong style={{ fontSize: 14 }}>{firstPerson?.fullName}</Text>
                  </div>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>NGÀY SINH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.dateOfBirth?.format ? firstPerson.dateOfBirth.format('DD/MM/YYYY') : firstPerson?.dateOfBirth}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>GIỚI TÍNH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.gender}</Text>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>SỐ ĐIỆN THOẠI</Text>
                    <br/>
                    <Text style={{ fontSize: 13 }}>{firstPerson?.phoneNumber}</Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>EMAIL</Text>
                    <br/>
                    <Text style={{ fontSize: 13 }}>{firstPerson?.email}</Text>
                  </div>
                  <Row gutter={8} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>MỐI QUAN HỆ</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.relationship}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>LOẠI MẪU</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{firstPerson?.sampleType}</Text>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>SỐ CCCD/CMND</Text>
                    <br/>
                    <Text style={{ fontSize: 13 }}>{firstPerson?.personalId}</Text>
                  </div>
                </div>
              </div>
            </Col>
            
            {/* Person 2 */}
            <Col span={12}>
              <div style={{ 
                padding: 16, 
                backgroundColor: '#fff', 
                borderRadius: 8, 
                border: '2px solid #52c41a',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: -10,
                  left: 12,
                  backgroundColor: '#52c41a',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  👥 NGƯỜI THỨ HAI
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>HỌ VÀ TÊN</Text>
                    <br/>
                    <Text strong style={{ fontSize: 14 }}>{secondPerson?.fullName}</Text>
                  </div>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>NGÀY SINH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.dateOfBirth?.format ? secondPerson.dateOfBirth.format('DD/MM/YYYY') : secondPerson?.dateOfBirth}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>GIỚI TÍNH</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.gender}</Text>
                    </Col>
                  </Row>
                  <Row gutter={8} style={{ marginTop: 8 }}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>MỐI QUAN HỆ</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.relationship}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 11 }}>LOẠI MẪU</Text>
                      <br/>
                      <Text style={{ fontSize: 13 }}>{secondPerson?.sampleType}</Text>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Cost Breakdown Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: '#fa8c16', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <CreditCardOutlined style={{ color: 'white', fontSize: 16 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#fa8c16' }}>Chi phí chi tiết</span>
            </div>
          }
          style={{ 
            marginBottom: 20, 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: '1px solid #fff2e8'
          }}
          headStyle={{ 
            backgroundColor: '#fff2e8', 
            borderBottom: '1px solid #ffbb96',
            borderRadius: '12px 12px 0 0'
          }}
        >
          <div style={{ padding: '8px 0' }}>
            <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#fafafa', borderRadius: 6 }}>
              <Text>💰 Phí dịch vụ xét nghiệm</Text>
              <Text strong>{formatCurrency(serviceCost)}</Text>
            </Row>

            {/* Collection Method Cost - Always show with free label when Express Service is selected */}
            {bookingData.collectionMethod && (
              <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: isExpressService ? '#f6ffed' : '#fafafa', borderRadius: 6, border: isExpressService ? '1px solid #b7eb8f' : 'none' }}>
                <Text>🔬 Phí thu mẫu ({bookingData.collectionMethod?.name})</Text>
                {isExpressService ? (
                  <Text strong style={{ color: '#52c41a' }}>Miễn phí (0 đồng)</Text>
                ) : (
                  <Text strong>{formatCurrency(collectionCost)}</Text>
                )}
              </Row>
            )}

            {/* Hiển thị phí vận chuyển theo loại */}
            {medicationMethod === 'staff-collection' && (
              <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f6ffed', borderRadius: 6, border: '1px solid #b7eb8f' }}>
                <Text>🏠 Phí thu mẫu tại nhà (Staff Collection)</Text>
                {isExpressService ? (
                  <Text strong style={{ color: '#52c41a' }}>Miễn phí (0 đồng)</Text>
                ) : (
                  <Text strong style={{ color: '#52c41a' }}>500,000 đ</Text>
                )}
              </Row>
            )}
            
            {medicationMethod === 'postal-delivery' && (
              <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#e6f7ff', borderRadius: 6, border: '1px solid #91d5ff' }}>
                <Text>📮 Phí gửi bưu điện (Postal Delivery)</Text>
                {isExpressService ? (
                  <Text strong style={{ color: '#1890ff' }}>Miễn phí (0 đồng)</Text>
                ) : (
                  <Text strong style={{ color: '#1890ff' }}>250,000 đ</Text>
                )}
              </Row>
            )}
            
            {medicationMethod === 'express' && (
              <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#fff7e6', borderRadius: 6, border: '1px solid #ffd591' }}>
                <Text>🚚 Phí dịch vụ express (Express Service)</Text>
                {isExpressService ? (
                  <Text strong style={{ color: '#fa8c16' }}>Miễn phí (0 đồng)</Text>
                ) : (
                  <Text strong style={{ color: '#fa8c16' }}>700,000 đ</Text>
                )}
              </Row>
            )}
            
            {medicationMethod === 'walk-in' && (
              <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: isExpressService ? '#f6ffed' : '#fafafa', borderRadius: 6, border: isExpressService ? '1px solid #b7eb8f' : 'none' }}>
                <Text>🏢 Phí dịch vụ tại cơ sở (Walk-in Service)</Text>
                {isExpressService ? (
                  <Text strong style={{ color: '#52c41a' }}>Miễn phí (0 đồng)</Text>
                ) : (
                  <Text strong>{formatCurrency(mediationCost)}</Text>
                )}
              </Row>
            )}
            
            {isExpressService && expressCost > 0 && (
              <Row justify="space-between" style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#fff2e8', borderRadius: 6 }}>
                <Text>⚡ Phí dịch vụ Express</Text>
                <Text strong style={{ color: '#fa8c16' }}>{formatCurrency(expressCost)}</Text>
              </Row>
            )}
            
            {/* Thông báo về miễn phí khi chọn Express Service */}
            {isExpressService && (
              <Row style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f6ffed', borderRadius: 6, border: '1px dashed #52c41a' }}>
                <Text style={{ color: '#389e0d', fontSize: '13px', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
                  💡 Khi sử dụng Express Service, tất cả các phương thức thu mẫu và vận chuyển đều được miễn phí (0 đồng)
                </Text>
              </Row>
            )}
            
            <Divider style={{ margin: '12px 0' }} />
            <Row justify="space-between" style={{ 
              padding: '12px 16px', 
              backgroundColor: '#e6f7ff', 
              borderRadius: 8, 
              border: '2px solid #1890ff' 
            }}>
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>💎 TỔNG CHI PHÍ</Text>
              <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{formatCurrency(totalCost)}</Text>
            </Row>
          </div>
        </Card>

        {/* Payment Method Card */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: paymentMethod === 'cash' ? '#52c41a' : '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {paymentMethod === 'cash' ? 
                  <CreditCardOutlined style={{ color: 'white', fontSize: 16 }} /> : 
                  <QrcodeOutlined style={{ color: 'white', fontSize: 16 }} />
                }
              </div>
              <span style={{ fontSize: 18, fontWeight: 600, color: paymentMethod === 'cash' ? '#52c41a' : '#1890ff' }}>Phương thức thanh toán</span>
            </div>
          }
          style={{ 
            borderRadius: 12, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            border: `1px solid ${paymentMethod === 'cash' ? '#f6ffed' : '#e6f7ff'}`
          }}
          headStyle={{ 
            backgroundColor: paymentMethod === 'cash' ? '#f6ffed' : '#e6f7ff', 
            borderBottom: `1px solid ${paymentMethod === 'cash' ? '#d9f7be' : '#91d5ff'}`,
            borderRadius: '12px 12px 0 0'
          }}
        >
          <div style={{ 
            padding: '16px', 
            backgroundColor: paymentMethod === 'cash' ? '#f6ffed' : '#e6f7ff', 
            borderRadius: 8, 
            border: `2px solid ${paymentMethod === 'cash' ? '#52c41a' : '#1890ff'}`,
            textAlign: 'center'
          }}>
            {paymentMethod === 'cash' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <CreditCardOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>💵 Thanh toán tiền mặt khi nhận dịch vụ</Text>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                  <QrcodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Text strong style={{ fontSize: 16, color: '#1890ff' }}>📱 Thanh toán qua VNPAY</Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // Render signature form với SignatureCanvas thật
  const renderSignature = () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px'
    }}>
      <Title level={3} style={{ 
        marginBottom: '30px', 
        color: '#1890ff',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        ✍️ Vui lòng ký tên để xác nhận
      </Title>
      
      <div style={{ 
        border: '3px dashed #1890ff', 
        borderRadius: '12px', 
        padding: '30px', 
        marginBottom: '24px', 
        backgroundColor: '#f8fcff',
        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width: 700,
            height: 300,
            className: 'signature-canvas',
            style: { 
              border: '2px solid #e6f7ff', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }
          }}
        />
      </div>
      
      <Space size="large" style={{ marginBottom: '20px' }}>
        <Button 
          type="default" 
          size="large"
          onClick={() => signatureRef.current?.clear()}
          disabled={isProcessingSignature}
          style={{ 
            height: '44px',
            padding: '0 24px',
            fontSize: '16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🗑️ Xóa chữ ký
        </Button>
      </Space>
      
      {isProcessingSignature && (
        <div style={{ 
          color: '#1890ff', 
          fontSize: '14px',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <span>⏳ Đang xử lý chữ ký...</span>
        </div>
      )}
      
      <div style={{ 
        color: '#666', 
        fontSize: '16px', 
        lineHeight: '1.5',
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: '#f6ffed',
        padding: '16px 24px',
        borderRadius: '8px',
        border: '1px solid #d9f7be'
      }}>
        💡 Vẽ chữ ký của bạn trong khung trên bằng chuột hoặc ngón tay.<br/>
        Chữ ký sẽ được sử dụng để xác nhận đơn đăng ký của bạn.
      </div>
    </div>
  );

    // Hàm tái tạo và tải PDF
const regenerateAndDownloadPDF = async (bookingCode) => {
  try {
    setIsGeneratingPDF(true);
    
    // Hiển thị thông báo đang xử lý
    const processingMsg = message.loading('Đang tạo lại file PDF...', 0);
    
    try {
      // Tái tạo PDF với dữ liệu hiện tại và tham số shouldDownload là true để tải xuống
      await generatePDF(true);
      
      // Đóng thông báo đang xử lý
      processingMsg();
      
      // Thông báo thành công
      message.success('Tải lại file PDF thành công!');
    } catch (pdfError) {
      // Đóng thông báo đang xử lý
      processingMsg();
      console.error('Lỗi khi tạo lại PDF:', pdfError);
      message.error(`Không thể tạo lại PDF: ${pdfError.message}. Vui lòng thử lại!`);
    }
  } catch (error) {
    console.error('Error regenerating PDF:', error);
    message.error('Không thể tải lại PDF. Vui lòng thử lại!');
  } finally {
    setIsGeneratingPDF(false);
  }
};

  // Render success với option xuất PDF
  // ✅ renderSuccess chỉ còn JSX, không có function definition
const renderSuccess = () => {
  return (
    <div className="text-center">
      <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>Đặt lịch thành công!</Title>
      <div style={{ marginBottom: '16px', fontSize: '16px' }}>
        {getSuccessMessage()}
      </div>
      
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
        Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
      </div>
      
      {/* PDF Export Option */}
      {showPDFOption && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f6ffed', 
          border: '1px solid #b7eb8f', 
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <FileTextOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
          <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
            Xuất đơn đăng ký xét nghiệm DNA
          </div>
          <div style={{ marginBottom: '16px', color: '#666' }}>
            Bạn có muốn tải xuống file PDF đơn đăng ký không?
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Tải xuống PDF
            </Button>
            <Button onClick={handleSkipPDF}>
              Bỏ qua
            </Button>
          </Space>
        </div>
      )}
      
      {/* Thêm option tải lại PDF */}
      <div style={{ 
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        border: '1px solid #bae7ff'
      }}>
        <Text style={{ display: 'block', marginBottom: '12px' }}>
          📄 Bạn có thể tải lại file PDF bất cứ lúc nào
        </Text>
        <Button 
          type="link" 
          icon={<DownloadOutlined />}
          onClick={() => regenerateAndDownloadPDF(paymentCode)}
          loading={isGeneratingPDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? 'Đang tạo PDF...' : 'Tải lại PDF'}
        </Button>
      </div>
    </div>
  );
};
const getSuccessMessage = () => {
  console.log('🔥 getSuccessMessage called!'); // Debug: Kiểm tra function có được gọi không
  
  const { collectionMethod, appointmentDate, timeSlot } = bookingData;
  
  console.log('📍 Raw Data:', { 
    bookingData, 
    collectionMethod, 
    appointmentDate, 
    timeSlot, 
    paymentMethod 
  });
  
  const location = collectionMethod?.name === 'At Home' ? 'ở nhà' : 'ở cơ sở y tế';
  const appointmentInfo = appointmentDate && timeSlot ? 
    `đúng lịch hẹn ${moment(appointmentDate).format('DD/MM/YYYY')} lúc ${timeSlot}` :
    'đúng lịch hẹn đã đặt';
    
  console.log('📍 Generated Values:', { 
    location, 
    appointmentInfo,
    'collectionMethod?.name': collectionMethod?.name,
    'appointmentDate valid': appointmentDate ? moment(appointmentDate).isValid() : false
  });
  
  console.log('📍 Payment Method Check:', {
    paymentMethod,
    'paymentMethod type': typeof paymentMethod,
    'is cash': paymentMethod === 'cash',
    'trimmed': paymentMethod?.toString().trim().toLowerCase()
  });
  
  let message;
  if (paymentMethod === 'cash') {
    message = `Đặt lịch thành công! Vui lòng có mặt ${location} ${appointmentInfo} và thanh toán khi nhận dịch vụ.`;
    console.log('✅ Using CASH message');
  } else {
    message = `Đặt lịch thành công! Vui lòng có mặt ${location} ${appointmentInfo}.`;
    console.log('✅ Using NON-CASH message');
  }
  
  console.log('✅ Final Message:', message);
  return message;
};

  // Render step content
  const renderStepContent = () => {
    // Nếu đang ở bước xác nhận PDF hoặc đang xử lý VNPAY
    if (isPDFConfirmStep || isRedirectingToVNPAY) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
          <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
            Ký tên thành công!
          </Title>
          <Text style={{ fontSize: '16px', color: '#666', display: 'block', marginBottom: '32px' }}>
            Bạn có muốn tải xuống file PDF đơn đăng ký trước khi hoàn tất đặt lịch không?
          </Text>
          
          {/* PDF Export Option */}
          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: '12px',
            marginBottom: '24px',
            maxWidth: '500px',
            margin: '0 auto 24px auto'
          }}>
            <FileTextOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
            <div style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
              Xuất đơn đăng ký xét nghiệm DNA
            </div>
            <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
              File PDF sẽ chứa đầy đủ thông tin đăng ký và chữ ký của bạn
            </div>
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleDownloadPDF}
                loading={isGeneratingPDF || isRedirectingToVNPAY}
                disabled={isGeneratingPDF || isRedirectingToVNPAY}
                style={{ 
                  backgroundColor: '#52c41a', 
                  borderColor: '#52c41a',
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px'
                }}
              >
                {isGeneratingPDF 
                  ? 'Đang tạo PDF...' 
                  : (isRedirectingToVNPAY 
                    ? 'Đang chuyển hướng VNPAY...' 
                    : 'Tải xuống PDF'
                  )
                }
              </Button>
              <Button 
                size="large"
                onClick={handleSkipPDF}
                loading={isRedirectingToVNPAY}
                disabled={isGeneratingPDF || isRedirectingToVNPAY}
                style={{
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px'
                }}
              >
                {isRedirectingToVNPAY 
                  ? 'Đang chuyển hướng VNPAY...' 
                  : (paymentMethod === 'cash' ? 'Bỏ qua, hoàn tất đặt lịch' : 'Bỏ qua, thanh toán VNPAY')
                }
              </Button>
            </Space>
          </div>
          
          {/* Hiển thị thông báo loading khi đang chuyển hướng VNPAY */}
          {isRedirectingToVNPAY && (
            <div style={{ 
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#e6f7ff',
              borderRadius: '8px',
              border: '1px solid #91d5ff',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div 
                  className="vnpay-loading-spinner"
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #1890ff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%'
                  }}
                ></div>
                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  Đang xử lý thanh toán VNPAY...
                </Text>
              </div>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                🔄 Vui lòng đợi giây lát, bạn sẽ được chuyển hướng đến trang thanh toán
              </Text>
            </div>
          )}
          
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Bạn có thể tải file PDF sau trong phần lịch sử đặt lịch
          </Text>
        </div>
      );
    }
    
    switch (currentStep) {
      case 1:
        return renderSummary();
      case 2:
        // Step 2: Signature cho tất cả payment methods
        return renderSignature();
      case 3:
        // Step 3: Không dùng nữa
        return renderSuccess();
      case 4:
        return renderSuccess();
      default:
        return null;
    }
  };

  // Render footer
  const renderFooter = () => {
    // Ẩn footer khi đang ở bước xác nhận PDF hoặc đang xử lý VNPAY
    if (isPDFConfirmStep || isRedirectingToVNPAY) {
      return null;
    }
    
    switch (currentStep) {
      case 1:
        return [
          <Button key="edit" onClick={handleEdit}>Edit</Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={handleConfirm} 
            loading={isSubmittingPayment}
            disabled={isSubmittingPayment}
          >
            {isSubmittingPayment ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        ];
      case 2:
        // Step 2: Ký tên cho tất cả payment methods
        return [
          <Button key="back" onClick={() => setCurrentStep(1)} disabled={isProcessingSignature}>Quay lại</Button>,
          <Button key="complete" type="primary" onClick={handleSignatureComplete} loading={isProcessingSignature} disabled={isProcessingSignature}>Ký tên</Button>
        ];
      case 4:
        return [
          <Button key="close" type="primary" onClick={handleClose}>Đóng</Button>
        ];
      default:
        return [];
    }
  };

  // Steps - động dựa trên phương thức thanh toán
  const getSteps = () => {
    // Flow mới: cả cash và VNPAY đều có cùng steps
    return [
      { title: 'Xác nhận thông tin' },
      { title: 'Ký tên' },
      { title: 'Tùy chọn PDF' },
      { title: paymentMethod === 'cash' ? 'Hoàn tất' : 'Thanh toán & Hoàn tất' }
    ];
  };

  const getCurrentStepIndex = () => {
    if (isPDFConfirmStep) {
      return 2; // PDF confirmation step
    }
    
    if (currentStep === 1) return 0; // Xác nhận
    if (currentStep === 2) return 1; // Ký tên
    if (currentStep === 4) return 3; // Hoàn tất
    
    return 0;
  };

  return (
    <Modal
      title="Xác nhận đặt lịch"
      open={visible}
      onCancel={handleClose}
      footer={renderFooter()}
      width={1000}
      destroyOnClose
      centered
      closable={!isRedirectingToVNPAY} // Không cho phép đóng khi đang chuyển hướng VNPAY
      maskClosable={!isRedirectingToVNPAY} // Không cho phép đóng bằng cách bấm ra ngoài
      keyboard={!isRedirectingToVNPAY} // Không cho phép đóng bằng phím ESC
      styles={{
        body: {
          padding: '0',
          maxHeight: '80vh',
          overflowY: 'auto'
        }
      }}
      bodyStyle={{
        padding: '0',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <div style={{ padding: '32px' }}>
        <Steps current={getCurrentStepIndex()} items={getSteps()} className="mb-6" />
        {renderStepContent()}
      </div>
    </Modal>
  );
};

const BookingPage = () => {
  const { customerID } = useSelector(state => state.user);
  const [form] = Form.useForm();
  // Không sử dụng navigate trong useEffect mới nên xóa khỏi khai báo
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const serviceID = searchParams.get('serviceID');
  const expressService = searchParams.get('express');
  
  // State cho form booking
  const [selectedServiceType, setSelectedServiceType] = useState('legal');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCollectionMethod, setSelectedCollectionMethod] = useState(null);
  const [selectedMedicationMethod, setSelectedMedicationMethod] = useState('walk-in');
  const [isExpressService, setIsExpressService] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [homeAddress, setHomeAddress] = useState('');
  const [selectedKitType, setSelectedKitType] = useState(''); // Thêm state cho loại kit
  
  // State cho modal xác nhận
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================ BOOKING TRACKING SYSTEM ================
  // State cho booking tracking
  const [bookingId, setBookingId] = useState(null);
  const [currentServiceID, setCurrentServiceID] = useState(serviceID);
  const [bookingProcess, setBookingProcess] = useState({
    stage: 'form_filling', // form_filling, form_submitted, api_called, payment_processing, payment_completed, signature_required, signature_completed, pdf_generated, completed
    timestamp: new Date().toISOString(),
    data: {}
  });
  const [bookingSteps, setBookingSteps] = useState([]);
  const [bookingSession, setBookingSession] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  const isServicePreSelected = Boolean(serviceID);
  const isExpressPreSelected = Boolean(expressService === 'true');
  const isStandardPreSelected = Boolean(expressService === 'false');
  const currentServicesData = selectedServiceType === 'legal' ? legalServicesData : nonLegalServicesData;
  const currentCollectionMethods = selectedServiceType === 'legal' ? legalCollectionMethodsData : nonLegalCollectionMethodsData;
  
  // Tính toán giá
  const calculateTotalCost = () => {
    // Phí cơ bản của dịch vụ
    let serviceCost = (selectedService && selectedService.basePrice) ? Number(selectedService.basePrice) : 0;
    
    // Phí thu mẫu - phải đảm bảo giá trị không bị null hoặc undefined
    let collectionCost = 0;
    // Khi chọn express service, collection method luôn miễn phí (0 đồng)
    if (!isExpressService) {
      collectionCost = (selectedCollectionMethod && selectedCollectionMethod.price) ? Number(selectedCollectionMethod.price) : 0;
    }
    
    // Log để debug
    console.log('Collection Method:', selectedCollectionMethod);
    console.log('Collection Cost (after express check):', collectionCost);
    console.log('Express Service:', isExpressService);
    
    // Phí vận chuyển
    let medicationCost = 0;
    
    // Phí express
    let expressCost = 0;
    
    // Tính phí express nếu được chọn
    if (isExpressService) {
      expressCost = (selectedService && selectedService.expressPrice) ? Number(selectedService.expressPrice) : 1500000;
      // Khi chọn express service, collection method luôn miễn phí (0 đồng)
      collectionCost = 0;
    }
    
    // Tính phí vận chuyển theo phương thức
    if (selectedMedicationMethod === 'staff-collection') {
      medicationCost = isExpressService ? 0 : 500000; // Miễn phí nếu đã chọn express service
    } else if (selectedMedicationMethod === 'postal-delivery') {
      medicationCost = isExpressService ? 0 : 250000; // Miễn phí nếu đã chọn express service
    } else if (selectedMedicationMethod === 'express') {
      medicationCost = isExpressService ? 0 : 700000; // Miễn phí nếu đã chọn express service
    }
    
    // Tính tổng chi phí
    const total = (isNaN(serviceCost) ? 0 : serviceCost) + 
                  (isNaN(collectionCost) ? 0 : collectionCost) + 
                  (isNaN(medicationCost) ? 0 : medicationCost) + 
                  (isNaN(expressCost) ? 0 : expressCost);
    
    console.log('Tổng chi phí:', {
      serviceCost,
      collectionCost,
      medicationCost,
      expressCost,
      total
    });
    
    return total;
  };
  
  // Time slots available
  const timeSlots = [
    '8:15 - 9:15',
    '9:30 - 10:30', 
    '10:45 - 11:45',
    '13:15 - 14:15',
    '14:30 - 15:30',
    '15:45 - 16:45'
  ];
  
  // Function để check xem time slot có bị disable không
  const isTimeSlotDisabled = (timeSlot) => {
    if (!appointmentDate) return false;
    
    const today = new Date();
    const selectedDate = new Date(appointmentDate);
    
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const startTime = timeSlot.split(' - ')[0];
    const [hour, minute] = startTime.split(':').map(Number);
    const slotTime = hour * 60 + minute;
    
    return slotTime <= currentTime;
  };

  // Thêm function để kiểm tra xem tất cả khung giờ đã qua chưa
  const areAllTimeSlotsDisabled = () => {
    if (!appointmentDate) return false;
    
    const today = new Date();
    const selectedDate = new Date(appointmentDate);
    
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }
    
    return timeSlots.every(timeSlot => isTimeSlotDisabled(timeSlot));
  };

  // Sample types
  const sampleTypes = [
    'Blood',
    'Buccal Swab',
    'Hair',
    'Nail',
    'Amniotic Fluid' // Thêm loại mẫu nước ối cho NIPT
  ];

  // Hàm lọc mối quan hệ theo dịch vụ được chọn
  const getValidRelationshipsForService = useCallback((serviceName) => {
    if (!serviceName) return [];
    
    const validPairs = serviceRelationshipMap.get(serviceName) || [];
    const validRelationships = new Set();
    
    validPairs.forEach(pair => {
      const relationships = relationshipPairs[pair];
      if (relationships) {
        relationships.forEach(rel => validRelationships.add(rel));
      }
    });
    
    // Xử lý đặc biệt cho DNA Testing for Inheritance or Asset Division
    // Sắp xếp theo thứ tự ưu tiên: Father/Mother - Child > Grandparent - Grandchild > Sibling - Sibling
    if (serviceName === 'DNA Testing for Inheritance or Asset Division') {
      const orderedRelationships = [];
      
      // Thứ tự ưu tiên 1: Father/Mother - Child
      if (validRelationships.has('Father')) orderedRelationships.push('Father');
      if (validRelationships.has('Mother')) orderedRelationships.push('Mother');
      if (validRelationships.has('Child')) orderedRelationships.push('Child');
      
      // Thứ tự ưu tiên 2: Grandparent - Grandchild
      if (validRelationships.has('Grandparent')) orderedRelationships.push('Grandparent');
      if (validRelationships.has('Grandchild')) orderedRelationships.push('Grandchild');
      
      // Thứ tự ưu tiên 3: Sibling - Sibling
      if (validRelationships.has('Sibling')) orderedRelationships.push('Sibling');
      
      return orderedRelationships;
    }
    
    return Array.from(validRelationships);
  }, []);

  // Thêm hàm để lấy mối quan hệ hợp lệ cho người thứ hai dựa trên người thứ nhất
  const getValidRelationshipsForSecondPerson = useCallback((serviceName, firstPersonRelationship) => {
    if (!serviceName || !firstPersonRelationship) {
      return getValidRelationshipsForService(serviceName);
    }
    
    // Xử lý đặc biệt cho DNA Testing for Birth Certificate
    if (serviceName === 'DNA Testing for Birth Certificate') {
      // Nếu người thứ nhất là Father, người thứ hai chỉ có thể là Child
      if (firstPersonRelationship === 'Father') {
        return ['Child'];
      }
      // Nếu người thứ nhất là Mother, người thứ hai chỉ có thể là Child
      else if (firstPersonRelationship === 'Mother') {
        return ['Child'];
      }
      // Nếu người thứ nhất là Child, người thứ hai chỉ có thể là Father hoặc Mother
      else if (firstPersonRelationship === 'Child') {
        return ['Father', 'Mother'];
      }
      // Trường hợp khác (không nên xảy ra)
      return ['Father', 'Mother', 'Child'];
    }
    
    const validPairs = serviceRelationshipMap.get(serviceName) || [];
    const validSecondPersonRelationships = new Set();
    
    validPairs.forEach(pairKey => {
      const pair = relationshipPairs[pairKey];
      if (pair) {
        // Nếu first person chọn pair[0], thì second person chỉ có thể chọn pair[1]
        if (pair[0] === firstPersonRelationship) {
          validSecondPersonRelationships.add(pair[1]);
        }
        // Nếu first person chọn pair[1], thì second person chỉ có thể chọn pair[0]
        else if (pair[1] === firstPersonRelationship) {
          validSecondPersonRelationships.add(pair[0]);
        }
      }
    });
    
    return Array.from(validSecondPersonRelationships);
  }, [getValidRelationshipsForService]);

  // Hàm kiểm tra cặp mối quan hệ có hợp lệ với dịch vụ không
  const isValidRelationshipPair = (serviceName, relationship1, relationship2) => {
    if (!serviceName || !relationship1 || !relationship2) return false;
    
    // Xử lý đặc biệt cho DNA Testing for Birth Certificate
    if (serviceName === 'DNA Testing for Birth Certificate') {
      // Cho phép các cặp: father-child, child-father, mother-child, child-mother
      const validCombinations = [
        ['Father', 'Child'],
        ['Child', 'Father'],
        ['Mother', 'Child'],
        ['Child', 'Mother']
      ];
      
      return validCombinations.some(pair => 
        (pair[0] === relationship1 && pair[1] === relationship2) ||
        (pair[0] === relationship2 && pair[1] === relationship1)
      );
    }
    
    const validPairs = serviceRelationshipMap.get(serviceName) || [];
    
    return validPairs.some(pairKey => {
      const pair = relationshipPairs[pairKey];
      if (!pair) return false;
      
      // Kiểm tra cả hai chiều của cặp quan hệ
      return (pair[0] === relationship1 && pair[1] === relationship2) ||
             (pair[0] === relationship2 && pair[1] === relationship1);
    });
  };

  // ================ BOOKING TRACKING HELPER FUNCTIONS ================
  
  // Initialize booking session
  const initializeBookingSession = useCallback(() => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      sessionId,
      startTime: new Date().toISOString(),
      serviceId: currentServiceID,
      customerId: customerID,
      stage: 'initialized',
      data: {}
    };
    
    setBookingSession(session);
    
    // Save to localStorage
    localStorage.setItem('current_booking_session', JSON.stringify(session));
    
    // Track initialization
    updateBookingProcess('session_initialized', { sessionId });
    
    return session;
  }, [currentServiceID, customerID]);

  // Save booking session to localStorage
  const saveBookingSession = useCallback((sessionData) => {
    const updatedSession = {
      ...bookingSession,
      ...sessionData,
      lastUpdated: new Date().toISOString()
    };
    
    setBookingSession(updatedSession);
    localStorage.setItem('current_booking_session', JSON.stringify(updatedSession));
  }, [bookingSession]);

  // Restore booking session from localStorage
  const restoreBookingSession = useCallback(() => {
    try {
      const storedSession = localStorage.getItem('current_booking_session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setBookingSession(session);
        
        // Update process stage
        setBookingProcess(prev => ({
          ...prev,
          stage: session.stage || 'form_filling',
          timestamp: new Date().toISOString()
        }));
        
        return session;
      }
    } catch (error) {
      console.error('Error restoring booking session:', error);
    }
    return null;
  }, []);

  // Clear booking session
  const clearBookingSession = useCallback(() => {
    setBookingSession(null);
    localStorage.removeItem('current_booking_session');
    
    // Reset process
    setBookingProcess({
      stage: 'form_filling',
      timestamp: new Date().toISOString(),
      data: {}
    });
  }, []);

  // Update booking process stage
  const updateBookingProcess = useCallback((stage, data = {}) => {
    const processUpdate = {
      stage,
      timestamp: new Date().toISOString(),
      data: { ...bookingProcess.data, ...data }
    };
    
    setBookingProcess(processUpdate);
    
    // Add to steps history
    const step = {
      id: Date.now(),
      stage,
      timestamp: new Date().toISOString(),
      data,
      sessionId: bookingSession?.sessionId
    };
    
    setBookingSteps(prev => [...prev, step]);
    
    // Save to session
    if (bookingSession) {
      saveBookingSession({
        stage,
        lastAction: step
      });
    }
  }, [bookingProcess.data, bookingSession, saveBookingSession]);

  // Update booking steps
  const updateBookingSteps = useCallback((stepData) => {
    const step = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      sessionId: bookingSession?.sessionId,
      ...stepData
    };
    
    setBookingSteps(prev => [...prev, step]);
    
    // Keep only last 20 steps to avoid memory issues
    if (bookingSteps.length > 20) {
      setBookingSteps(prev => prev.slice(-20));
    }
  }, [bookingSession?.sessionId, bookingSteps.length]);

  // Add to booking history
  const addToBookingHistory = useCallback((bookingData) => {
    const historyEntry = {
      id: Date.now(),
      bookingId: bookingData.bookingId || bookingData.paymentCode,
      serviceId: bookingData.service?.serviceID,
      serviceName: bookingData.service?.serviceName,
      customerName: bookingData.firstPerson?.fullName,
      totalCost: bookingData.totalCost,
      status: bookingData.status || 'completed',
      timestamp: new Date().toISOString(),
      sessionId: bookingSession?.sessionId
    };
    
    setBookingHistory(prev => {
      const updated = [historyEntry, ...prev];
      
      // Keep only last 50 entries
      const limited = updated.slice(0, 50);
      
      // Save to localStorage
      localStorage.setItem('booking_history', JSON.stringify(limited));
      
      return limited;
    });
  }, [bookingSession?.sessionId]);

  // Get booking progress percentage
  const getBookingProgress = useCallback(() => {
    const stages = [
      'form_filling', 'form_submitted', 'api_called', 
      'payment_processing', 'payment_completed', 
      'signature_required', 'signature_completed', 
      'pdf_generated', 'completed'
    ];
    
    const currentIndex = stages.indexOf(bookingProcess.stage);
    return currentIndex >= 0 ? Math.round(((currentIndex + 1) / stages.length) * 100) : 0;
  }, [bookingProcess.stage]);

  // Get booking summary
  const getBookingSummary = useCallback(() => {
    return {
      sessionId: bookingSession?.sessionId,
      bookingId: bookingId,
      serviceId: currentServiceID,
      customerId: customerID,
      stage: bookingProcess.stage,
      progress: getBookingProgress(),
      stepsCount: bookingSteps.length,
      historyCount: bookingHistory.length,
      startTime: bookingSession?.startTime,
      lastUpdated: bookingSession?.lastUpdated
    };
  }, [bookingSession, bookingId, currentServiceID, customerID, bookingProcess.stage, getBookingProgress, bookingSteps.length, bookingHistory.length]);

  // ================ END BOOKING TRACKING HELPER FUNCTIONS ================

  // Cập nhật danh sách relationships dựa trên service được chọn
  const [availableRelationships, setAvailableRelationships] = useState([
    'Father', 'Mother', 'Child', 'Sibling',
    'Grandparent', 'Grandchild'
  ]);

  // Thêm state để quản lý available relationships cho second person
  const [availableSecondPersonRelationships, setAvailableSecondPersonRelationships] = useState([
    'Father', 'Mother', 'Child', 'Sibling',
    'Grandparent', 'Grandchild'
  ]);

  // Relationships
  const relationships = [
    'Father', 'Mother', 'Child', 'Sibling',
    'Grandparent', 'Grandchild', 'Other'
  ];

  // Validation functions
 const validateAge18 = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng chọn ngày sinh!"));
    }

    // Convert moment object to JavaScript Date
    let birthDate;
    if (moment.isMoment(value)) {
      birthDate = value.toDate(); // Convert moment to native Date
    } else {
      birthDate = new Date(value);
    }

    if (isNaN(birthDate.getTime())) {
      return Promise.reject(new Error("Ngày sinh không hợp lệ!"));
    }

    const today = new Date();

    // Tính tuổi chính xác
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Nếu chưa đến tháng sinh hoặc đến tháng sinh nhưng chưa đến ngày sinh
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    console.log("-----------------------------");
    console.log("birthDate:", birthDate.toISOString().split("T")[0]);
    console.log("today:", today.toISOString().split("T")[0]);
    console.log("calculated age:", age);
    console.log("-----------------------------");

    if (age < 18) {
      return Promise.reject(
        new Error("Người đại diện phải từ 18 tuổi trở lên!")
      );
    }

    return Promise.resolve();
  };

  // Thêm hàm kiểm tra tuổi người thứ hai dựa trên mối quan hệ
  const validateSecondPersonAge = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng chọn ngày sinh!"));
    }

    // Lấy mối quan hệ người thứ hai
    const relationship = form.getFieldValue(['secondPerson', 'relationship']);
    
    // Nếu chưa chọn relationship, chỉ validate là có chọn ngày sinh
    if (!relationship) {
      return Promise.resolve();
    }

    // Convert moment object to JavaScript Date
    let birthDate;
    if (moment.isMoment(value)) {
      birthDate = value.toDate();
    } else {
      birthDate = new Date(value);
    }

    if (isNaN(birthDate.getTime())) {
      return Promise.reject(new Error("Ngày sinh không hợp lệ!"));
    }

    const today = new Date();

    // Tính tuổi chính xác
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Nếu không phải là Child, phải từ 18 tuổi trở lên
    if (relationship !== 'Child' && age < 18) {
      return Promise.reject(
        new Error(`Người có mối quan hệ "${relationship}" phải từ 18 tuổi trở lên!`)
      );
    }

    // Đặc biệt kiểm tra Father và Mother, phải từ 18 tuổi trở lên
    if ((relationship === 'Father' || relationship === 'Mother') && age < 18) {
      return Promise.reject(
        new Error(`Người có mối quan hệ "${relationship}" phải từ 18 tuổi trở lên!`)
      );
    }

    return Promise.resolve();
  };

  // Kit Types
  const kitTypes = [
    { value: 'K001', label: 'PowerPlex Fusion', price: 0 },
    { value: 'K002', label: 'Global Filer', price: 0 }
  ];

  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập số điện thoại!'));
    }
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('Số điện thoại phải có 10-11 số (có thể bắt đầu bằng +84)!'));
    }
    return Promise.resolve();
  };

  const validatePersonalId = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập số CCCD/CMND!'));
    }
    const idRegex = /^[0-9]{9}$|^[0-9]{12}$/;
    if (!idRegex.test(value)) {
      return Promise.reject(new Error('Số CCCD/CMND phải có 9 hoặc 12 số!'));
    }
    return Promise.resolve();
  };

  const validateAppointmentDate = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn ngày hẹn!'));
    }
    if (moment(value).isBefore(moment(), 'day')) {
      return Promise.reject(new Error('Không được chọn ngày trong quá khứ!'));
    }
    return Promise.resolve();
  };

  // Cập nhật validation function cho relationship
  const validateRelationshipPair = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    return Promise.resolve(); // Chỉ validate required, không validate pair ở đây
  };

  // Tạo validation riêng cho second person để kiểm tra cặp
  const validateSecondPersonRelationship = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    
    // Chỉ kiểm tra cặp khi cả hai đã được chọn
    if (firstPersonRelationship && value && selectedService?.name) {
      if (!isValidRelationshipPair(selectedService.name, firstPersonRelationship, value)) {
        const validPairs = serviceRelationshipMap.get(selectedService.name) || [];
        const pairNames = validPairs.map(pair => {
          const relationships = relationshipPairs[pair];
          return relationships ? relationships.join(' - ') : pair;
        }).join(', ');
        
        return Promise.reject(new Error(`Cặp mối quan hệ không hợp lệ cho dịch vụ này. Các cặp hợp lệ: ${pairNames}`));
      }
    }
    
    return Promise.resolve();
  };

  const validateRelationshipDifferent = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    // Nếu một trong hai là 'Sibling' thì cho phép trùng
    if (value === 'Sibling' || firstPersonRelationship === 'Sibling') {
      return Promise.resolve();
    }
    if (value === firstPersonRelationship) {
      return Promise.reject(new Error('Mối quan hệ của người thứ hai phải khác với người đại diện (trừ trường hợp Sibling)!'));
    }
    return Promise.resolve();
  };

  const validateGenderRelationship = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    const gender = form.getFieldValue(['firstPerson', 'gender']);
    
    // Kiểm tra logic giới tính và quan hệ
    if (gender === 'male' && value === 'Mother') {
      return Promise.reject(new Error('Nam giới không thể chọn mối quan hệ "Mother"!'));
    }
    
    if (gender === 'female' && value === 'Father') {
      return Promise.reject(new Error('Nữ giới không thể chọn mối quan hệ "Father"!'));
    }
    
    return Promise.resolve();
  };

  const validateSecondPersonGenderRelationship = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn mối quan hệ!'));
    }
    
    const gender = form.getFieldValue(['secondPerson', 'gender']);
    
    // Kiểm tra logic giới tính và quan hệ cho người thứ hai
    if (gender === 'male' && value === 'Mother') {
      return Promise.reject(new Error('Nam giới không thể chọn mối quan hệ "Mother"!'));
    }
    
    if (gender === 'female' && value === 'Father') {
      return Promise.reject(new Error('Nữ giới không thể chọn mối quan hệ "Father"!'));
    }
    
    // Kiểm tra cặp mối quan hệ hợp lệ
    const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
    if (firstPersonRelationship && value && selectedService?.name) {
      if (!isValidRelationshipPair(selectedService.name, firstPersonRelationship, value)) {
        // Xử lý đặc biệt cho DNA Testing for Birth Certificate
        if (selectedService.name === 'DNA Testing for Birth Certificate') {
          const validCombinations = {
            'Father': ['Child'],
            'Mother': ['Child'],
            'Child': ['Father', 'Mother']
          };
          
          const validOptions = validCombinations[firstPersonRelationship] || [];
          return Promise.reject(new Error(`Với mối quan hệ "${firstPersonRelationship}" của người thứ nhất, người thứ hai phải chọn một trong các mối quan hệ: ${validOptions.join(', ')}`));
        } else {
          const validPairs = serviceRelationshipMap.get(selectedService.name) || [];
          const pairNames = validPairs.map(pair => {
            const relationships = relationshipPairs[pair];
            return relationships ? relationships.join(' - ') : pair;
          }).join(', ');
          
          return Promise.reject(new Error(`Cặp mối quan hệ không hợp lệ cho dịch vụ này. Các cặp hợp lệ: ${pairNames}`));
        }
      }
    }
    
    return Promise.resolve();
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  // Reset timeSlot when switching to postal-delivery
  useEffect(() => {
    if (selectedMedicationMethod === 'postal-delivery') {
      setTimeSlot('');
      form.setFieldsValue({ timeSlot: undefined });
    }
  }, [selectedMedicationMethod, form]);

  // Theo dõi thay đổi của Person First và tự động điền cho Person Second nếu chưa có dữ liệu hoặc còn trống
  useEffect(() => {
    try {
      const first = form.getFieldValue('firstPerson');
      const second = form.getFieldValue('secondPerson');
      // Nếu first đã điền đủ và second chưa điền hoặc giống mặc định thì tự động copy
      if (
        first &&
        first.fullName &&
        first.dateOfBirth &&
        first.gender &&
        first.relationship &&
        first.sampleType &&
        (
          !second ||
          (!second.fullName && !second.dateOfBirth && !second.gender && !second.relationship && !second.sampleType)
        )
      ) {
        form.setFieldsValue({
          secondPerson: {
            ...second,
            fullName: first.fullName,
            dateOfBirth: first.dateOfBirth,
            gender: first.gender,
            relationship: first.relationship,
            sampleType: first.sampleType
          }
        });
      }
    } catch (error) {
      // Ignore form errors during initialization
      console.warn('Form not ready yet:', error);
    }
  }, [form]);

  useEffect(() => {
    if (serviceID) {
      let foundService = legalServicesData.find(service => service.serviceID === serviceID);
      let serviceType = 'legal';
      
      if (!foundService) {
        foundService = nonLegalServicesData.find(service => service.serviceID === serviceID);
        serviceType = 'non-legal';
      }
      
      if (foundService) {
        setSelectedServiceType(serviceType);
        setSelectedService(foundService);
        
        const defaultCollectionMethods = serviceType === 'legal' ? legalCollectionMethodsData : nonLegalCollectionMethodsData;
        if (defaultCollectionMethods.length > 1) {
          setSelectedCollectionMethod(defaultCollectionMethods[1]);
        }
        
        setSelectedMedicationMethod('walk-in');
        
        if (expressService === 'true') {
          setIsExpressService(true);
          setSelectedMedicationMethod('express');
        }
      }
    }
  }, [serviceID, expressService]);
  
  const handleExpressServiceChange = (checked) => {
    setIsExpressService(checked);
    
    // Nếu tick Express Service và đang chọn Postal Delivery, reset về null
    if (checked && selectedMedicationMethod === 'postal-delivery') {
      setSelectedMedicationMethod(null);
    }
    
    if (checked) {
      setSelectedMedicationMethod('express');
      
      // Hiển thị thông báo về miễn phí dịch vụ collection method
      message.success({
        content: 'Khi sử dụng Express Service, tất cả các phương thức thu mẫu (Collection Method) sẽ được MIỄN PHÍ (0 đồng)',
        duration: 5,
        style: {
          marginTop: '10vh',
        }
      });
    } else {
      if (selectedCollectionMethod?.name === 'At Facility') {
        setSelectedMedicationMethod('walk-in');
      } else if (selectedCollectionMethod?.name === 'At Home') {
        setSelectedMedicationMethod('staff-collection');
      }
      
      // Thông báo khi bỏ chọn Express Service
      message.info({
        content: 'Bạn đã bỏ chọn Express Service. Phí thu mẫu sẽ được tính theo giá gốc.',
        duration: 4,
        style: {
          marginTop: '10vh',
        }
      });
    }
  };
  
  // Thêm useEffect để cập nhật relationships khi service thay đổi
  useEffect(() => {
    if (selectedService?.name) {
      const validRelationships = getValidRelationshipsForService(selectedService.name);
      setAvailableRelationships(validRelationships.length > 0 ? validRelationships : [
        'Father', 'Mother', 'Child', 'Sibling',
        'Grandparent', 'Grandchild'
      ]);
      
      // Reset relationships trong form khi service thay đổi
      form.setFieldsValue({
        firstPerson: { ...form.getFieldValue('firstPerson'), relationship: undefined },
        secondPerson: { ...form.getFieldValue('secondPerson'), relationship: undefined }
      });
      
      // Reset available relationships cho second person
      setAvailableSecondPersonRelationships(validRelationships.length > 0 ? validRelationships : [
        'Father', 'Mother', 'Child', 'Sibling',
        'Grandparent', 'Grandchild'
      ]);
      
      // Xử lý đặc biệt cho NIPT
      if (selectedService.name === 'Non-Invasive Relationship Testing (NIPT)') {
        // Nếu là NIPT, reset mẫu của người thứ hai (Child) và đặt là null
        form.setFieldsValue({
          secondPerson: { 
            ...form.getFieldValue('secondPerson'),
            sampleType: 'Amniotic Fluid' // Mẫu nước ối cho NIPT
          }
        });
      }
    }
  }, [selectedService, form, getValidRelationshipsForService]);

  // Cập nhật useEffect để theo dõi thay đổi của first person relationship
  useEffect(() => {
    try {
      const firstPersonRelationship = form.getFieldValue(['firstPerson', 'relationship']);
      
      if (selectedService?.name && firstPersonRelationship) {
        // Cập nhật available relationships cho second person dựa trên first person
        const validSecondRelationships = getValidRelationshipsForSecondPerson(
          selectedService.name, 
          firstPersonRelationship
        );
        setAvailableSecondPersonRelationships(validSecondRelationships.length > 0 
          ? validSecondRelationships 
          : availableRelationships
        );
        
        // Reset second person relationship nếu không còn hợp lệ
        const currentSecondRelationship = form.getFieldValue(['secondPerson', 'relationship']);
        if (currentSecondRelationship && !validSecondRelationships.includes(currentSecondRelationship)) {
          form.setFieldsValue({
            secondPerson: {
              ...form.getFieldValue('secondPerson'),
              relationship: undefined
            }
          });
        }
        
        // Xử lý đặc biệt cho NIPT
        if (selectedService.name === 'Non-Invasive Relationship Testing (NIPT)' && 
            firstPersonRelationship === 'Father' &&
            validSecondRelationships.includes('Child')) {
          // Tự động chọn Child cho người thứ hai
          form.setFieldsValue({
            secondPerson: {
              ...form.getFieldValue('secondPerson'),
              relationship: 'Child',
              sampleType: 'Amniotic Fluid' // Mẫu nước ối cho NIPT
            }
          });
        }
      } else {
        // Nếu chưa chọn service hoặc first person relationship, hiển thị tất cả
        setAvailableSecondPersonRelationships(availableRelationships);
      }
    } catch (error) {
      // Ignore form errors during initialization
      console.warn('Form not ready yet:', error);
    }
  }, [selectedService?.name, availableRelationships, form, getValidRelationshipsForSecondPerson]);

  useEffect(() => {
    try {
      // Trigger validation cho relationship khi gender thay đổi
      const firstPersonGender = form.getFieldValue(['firstPerson', 'gender']);
      const secondPersonGender = form.getFieldValue(['secondPerson', 'gender']);
      
      if (firstPersonGender) {
        form.validateFields([['firstPerson', 'relationship']]);
      }
      
      if (secondPersonGender) {
        form.validateFields([['secondPerson', 'relationship']]);
      }
    } catch (error) {
      // Ignore form errors during initialization
      console.warn('Form not ready yet:', error);
    }
  }, [form]);

  useEffect(() => {
    if (!serviceID && currentServicesData.length > 0) {
      setSelectedService(currentServicesData[0]);
    }
    if (currentCollectionMethods.length > 0) {
      setSelectedCollectionMethod(currentCollectionMethods[1]);
    }
  }, [selectedServiceType, serviceID, currentServicesData, currentCollectionMethods]);

  // Thêm useEffect để xử lý đặc biệt cho dịch vụ NIPT - chỉ cho phép chọn At Facility
  useEffect(() => {
    // Nếu dịch vụ được chọn là NIPT, tự động chọn At Facility
    if (selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)') {
      // Tự động set Collection Method là At Facility
      setSelectedCollectionMethod({name: 'At Facility', price: 0});
      // Tự động set Medication Method là Walk-in
      setSelectedMedicationMethod('walk-in');
      
      // Hiển thị thông báo cho người dùng
      message.info({
        content: 'Dịch vụ NIPT chỉ có thể thực hiện tại cơ sở y tế',
        duration: 4,
        style: {
          marginTop: '10vh',
        }
      });
    }
  }, [selectedService]);
  
  // Thêm useEffect để theo dõi thay đổi của service và collection method
  useEffect(() => {
    // Nếu service là NIPT và collection method không phải At Facility, tự động chuyển sang At Facility
    if (selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)' && 
        selectedCollectionMethod?.name !== 'At Facility') {
      setSelectedCollectionMethod({name: 'At Facility', price: 0});
      setSelectedMedicationMethod('walk-in');
    }
  }, [selectedService, selectedCollectionMethod]);

  // Thêm useEffect để xử lý đặc biệt cho dịch vụ DNA Testing for Birth Certificate
  useEffect(() => {
    // Nếu dịch vụ được chọn là DNA Testing for Birth Certificate
    if (selectedService?.name === 'DNA Testing for Birth Certificate') {
      // Hiển thị thông báo cho người dùng
      message.info({
        content: 'Dịch vụ DNA Testing for Birth Certificate chỉ cho phép chọn mối quan hệ Cha-Con hoặc Mẹ-Con',
        duration: 4,
        style: {
          marginTop: '10vh',
        }
      });
      
      // Đảm bảo chỉ hiển thị các mối quan hệ Cha-Con hoặc Mẹ-Con
      const validRelationships = ['Father', 'Mother', 'Child'];
      setAvailableRelationships(validRelationships);
      
      // Reset relationships trong form khi service thay đổi
      form.setFieldsValue({
        firstPerson: { ...form.getFieldValue('firstPerson'), relationship: undefined },
        secondPerson: { ...form.getFieldValue('secondPerson'), relationship: undefined }
      });
      
      // Reset available relationships cho second person
      setAvailableSecondPersonRelationships(validRelationships);
    }
  }, [selectedService, form]);
  
  const handleConfirmBooking = (values) => {
    // Lấy giá trị mới nhất từ Form (tránh lỗi khi Form chưa cập nhật kịp)
    const appointmentDateValue = form.getFieldValue('appointmentDate');
    const timeSlotValue = form.getFieldValue('timeSlot');

    // Validation bổ sung cho các trường bắt buộc
    if (!selectedService) {
      message.error('Vui lòng chọn dịch vụ!');
      return;
    }
    if (!selectedCollectionMethod) {
      message.error('Vui lòng chọn phương thức lấy mẫu!');
      return;
    }
    if (!selectedMedicationMethod) {
      message.error('Vui lòng chọn phương thức medication!');
      return;
    }
    if (!selectedKitType) {
      message.error('Vui lòng chọn loại kit!');
      return;
    }

    // Validation cho appointment date (bắt buộc cho tất cả trừ postal delivery)
    if (selectedMedicationMethod !== 'postal-delivery' && !appointmentDateValue) {
      message.error('Vui lòng chọn ngày hẹn!');
      return;
    }

    // Validation cho time slot (bắt buộc khi có appointment date và không phải postal delivery)
    if (selectedMedicationMethod !== 'postal-delivery' && appointmentDateValue && !timeSlotValue) {
      message.error('Vui lòng chọn khung giờ!');
      return;
    }

    // Validation cho home address (bắt buộc khi chọn at home hoặc postal delivery)
    if ((selectedCollectionMethod?.name === 'At Home' || selectedMedicationMethod === 'postal-delivery') && (!homeAddress || homeAddress.trim() === '')) {
      message.error('Vui lòng nhập địa chỉ nhà khi chọn lấy mẫu tại nhà hoặc giao hàng tận nơi!');
      return;
    }

    // Validation cho thông tin người thứ nhất (bắt buộc)
    if (!values.firstPerson?.fullName || values.firstPerson.fullName.trim() === '') {
      message.error('Vui lòng nhập họ và tên người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.email || values.firstPerson.email.trim() === '') {
      message.error('Vui lòng nhập email người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.gender) {
      message.error('Vui lòng chọn giới tính người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.relationship) {
      message.error('Vui lòng chọn mối quan hệ người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.sampleType) {
      message.error('Vui lòng chọn loại mẫu người thứ nhất!');
      return;
    }
    if (!values.firstPerson?.personalId) {
      message.error('Vui lòng nhập số CCCD/CMND người thứ nhất!');
      return;
    }

    // Validation cho thông tin người thứ hai (bắt buộc)
    if (!values.secondPerson?.fullName || values.secondPerson.fullName.trim() === '') {
      message.error('Vui lòng nhập họ và tên người thứ hai!');
      return;
    }
    if (!values.secondPerson?.dateOfBirth) {
      message.error('Vui lòng chọn ngày sinh người thứ hai!');
      return;
    }
    if (!values.secondPerson?.gender) {
      message.error('Vui lòng chọn giới tính người thứ hai!');
      return;
    }
    if (!values.secondPerson?.sampleType) {
      message.error('Vui lòng chọn loại mẫu người thứ hai!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Tạo booking data hoàn chỉnh
      const bookingData = {
        customerID,
        serviceType: selectedServiceType,
        service: selectedService,
        collectionMethod: selectedCollectionMethod,
        medicationMethod: selectedMedicationMethod,
        appointmentDate: appointmentDateValue ? appointmentDateValue.format('YYYY-MM-DD') : '',
        timeSlot: selectedMedicationMethod === 'postal-delivery' ? null : timeSlotValue,
        firstPerson: values.firstPerson,
        secondPerson: values.secondPerson,
        totalCost: calculateTotalCost(),
        paymentMethod,
        bookingTime: new Date().toISOString(),
        homeAddress,
        selectedKitType,
        isExpressService,
      };
      
      // Log để debug
      console.log('📋 Booking Data:', bookingData);
      console.log('📅 Appointment Date:', appointmentDateValue ? appointmentDateValue.format('YYYY-MM-DD') : 'N/A');
      
      // Tạo payload API theo format đã thành công
      const apiPayload = buildBookingPayload(bookingData);
      console.log('📤 API Payload:', apiPayload);
      
      // Test validation API payload
      console.log('🔍 API Payload validation:');
      console.log('- Has testSubjects:', apiPayload.testSubjects?.length);
      console.log('- testSubjects structure:', apiPayload.testSubjects?.map(s => ({
        fullname: s.fullname,
        gender: s.gender,
        sampleType: s.sampleType,
        relationship: s.relationship
      })));
      
      setBookingData(bookingData); // Đảm bảo bookingData luôn là dữ liệu mới nhất
      setIsModalVisible(true);
    } catch (error) {
      console.error('❌ Error in handleConfirmBooking:', error);
      message.error('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };
  function buildBookingPayload(data) {
    // Format date function
    const formatDate = (dateValue) => {
      if (!dateValue) return "";
      if (moment.isMoment(dateValue)) {
        return dateValue.format('YYYY-MM-DD');
      }
      if (typeof dateValue === 'string') return dateValue;
      return dateValue;
    };

    // Format gender function
    const formatGender = (genderValue) => {
      return genderValue === 'male' ? 1 : 2;
    };

    return {
      collectionMethod: data.collectionMethod?.name || "At Facility",
      paymentMethod: data.paymentMethod === 'vnpay' ? 'VNPAY' : 'Cash',
      appointmentTime: formatDate(data.appointmentDate),
      timeRange: data.timeSlot || '',
      status: "pending_payment",
      note: '',
      cost: 0,
      mediationMethod: data.medicationMethod || '',
      additionalCost: 0,
      totalCost: data.totalCost || 0,
      expressService: !!data.isExpressService,
      address: data.collectionMethod?.name === 'At Home' || data.medicationMethod === 'postal-delivery' ? data.homeAddress : '',
      kitID: data.selectedKitType || '',
      serviceID: data.service?.serviceID || '',
      customerID: data.customerID || '',
      customerName: data.firstPerson?.fullName || '',
      testSubjects: [
        {
          fullname: data.firstPerson.fullName || '',
          dateOfBirth: formatDate(data.firstPerson.dateOfBirth),
          gender: formatGender(data.firstPerson.gender),
          phone: data.firstPerson.phoneNumber || '',
          email: data.firstPerson.email || '',
          relationship: data.firstPerson.relationship || '',
          sampleType: data.firstPerson.sampleType || '',
          idNumber: data.firstPerson.personalId || ''
        },
        {
          fullname: data.secondPerson.fullName || '',
          dateOfBirth: formatDate(data.secondPerson.dateOfBirth),
          gender: formatGender(data.secondPerson.gender),
          phone: data.secondPerson.phoneNumber || '',
          email: data.secondPerson.email || '',
          relationship: data.secondPerson.relationship || '',
          sampleType: data.secondPerson.sampleType || '',
          idNumber: data.secondPerson.personalId || ''
        }
      ]
    };
  }
  const getSuccessMessage = () => {
  console.log('🔥 getSuccessMessage called!'); // Debug: Kiểm tra function có được gọi không
  
  const { collectionMethod, appointmentDate, timeSlot } = bookingData;
  
  console.log('📍 Raw Data:', { 
    bookingData, 
    collectionMethod, 
    appointmentDate, 
    timeSlot, 
    paymentMethod 
  });
  
  const location = collectionMethod?.name === 'At Home' ? 'ở nhà' : 'ở cơ sở y tế';
  const appointmentInfo = appointmentDate && timeSlot ? 
    `đúng lịch hẹn ${moment(appointmentDate).format('DD/MM/YYYY')} lúc ${timeSlot}` :
    'đúng lịch hẹn đã đặt';
    
  console.log('📍 Generated Values:', { 
    location, 
    appointmentInfo,
    'collectionMethod?.name': collectionMethod?.name,
    'appointmentDate valid': appointmentDate ? moment(appointmentDate).isValid() : false
  });
  
  console.log('📍 Payment Method Check:', {
    paymentMethod,
    'paymentMethod type': typeof paymentMethod,
    'is cash': paymentMethod === 'cash',
    'trimmed': paymentMethod?.toString().trim().toLowerCase()
  });
  
  let message;
  if (paymentMethod === 'cash') {
    message = `Đặt lịch thành công! Vui lòng có mặt ${location} ${appointmentInfo} và thanh toán khi nhận dịch vụ.`;
    console.log('✅ Using CASH message');
  } else {
    message = `Đặt lịch thành công! Vui lòng có mặt ${location} ${appointmentInfo}.`;
    console.log('✅ Using NON-CASH message');
  }
  
  console.log('✅ Final Message:', message);
  return message;
};

  // Thêm function xử lý khi hoàn tất booking từ modal
  const handleBookingComplete = async (finalBookingData) => {
  try {
    setIsSubmitting(true);
    const serviceID = finalBookingData.service?.serviceID;
    const customerID = finalBookingData.customerID;
    if (!serviceID || !customerID) {
      throw new Error('Thiếu serviceID hoặc customerID');
    }
    
    // Sử dụng payload API đã được chuẩn bị
    const payload = buildBookingPayload(finalBookingData);
    console.log('🔥 Final API Payload:', payload);
    
    // Sử dụng endpoint giống form đã thành công
      const response = await axios.post(`/booking/bookings/${serviceID}/${customerID}`, payload);
    if (!response.data) {
      throw new Error('Không nhận được dữ liệu từ server');
    }
    message.success(getSuccessMessage());
    // ✅ Thêm xuống dòng và dấu chấm phẩy
   setTimeout(() => {
  navigate('/'); // ✅ Đúng - dùng function
}, 2000);

    form.resetFields();
    setAppointmentDate('');
    setTimeSlot('');
    setIsModalVisible(false);
    setBookingData(null);
    setSelectedService(null);
    setSelectedCollectionMethod(null);
    setSelectedMedicationMethod('');
    setSelectedKitType(null);
    setHomeAddress('');
    setIsExpressService(false);
  } catch (error) {
    let errorMessage = 'Có lỗi xảy ra khi lưu thông tin đặt lịch!';
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }
    message.error(errorMessage);
    console.error('Booking error:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  // Function đóng modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setBookingData(null);
  };

  // Thêm hàm xử lý khi người dùng quay lại từ trang thanh toán VNPAY
  useEffect(() => {
    // Kiểm tra URL có chứa thông tin thanh toán VNPAY không
    const urlParams = new URLSearchParams(window.location.search);
    const vnpResponseCode = urlParams.get('vnp_ResponseCode');
    const vnpOrderInfo = urlParams.get('vnp_OrderInfo');
    
    console.log('VNPAY Params:', { vnpResponseCode, vnpOrderInfo });

    if (vnpResponseCode && vnpOrderInfo) {
      try {
        // Xóa tham số VNPAY khỏi URL ngay lập tức để tránh xử lý lại
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        if (vnpResponseCode === '00') {
          // Thanh toán thành công
          message.success({
            content: 'Thanh toán VNPAY thành công! Đặt lịch hoàn tất.',
            duration: 3,
            style: {
              marginTop: '20vh',
            },
          });
          console.log('VNPAY payment success - Redirecting to home');
          setTimeout(() => {
  navigate('/'); // ✅ Đúng - dùng function
}, 2000);
        } else {
          // Thanh toán thất bại
          const errorMessages = {
            '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ.',
            '09': 'Chưa đăng ký dịch vụ InternetBanking.',
            '10': 'Xác thực thông tin không đúng quá 3 lần',
            '11': 'Đã hết hạn chờ thanh toán.',
            '12': 'Thẻ/Tài khoản bị khóa.',
            '13': 'Nhập sai OTP.',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Không đủ số dư.',
            '65': 'Quá hạn mức giao dịch trong ngày.',
            '75': 'Ngân hàng thanh toán đang bảo trì.',
            '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định.',
            '99': 'Các lỗi khác'
          };
          const errorMessage = errorMessages[vnpResponseCode] || 'Thanh toán VNPAY thất bại hoặc bị hủy!';
          message.error(errorMessage);
          console.warn('VNPAY payment failed:', errorMessage);
        }
      } catch (error) {
        console.error('Error processing VNPAY return:', error);
        message.error('Có lỗi xảy ra khi xử lý kết quả thanh toán!');
      }
    } else {
      console.log('Không có thông tin VNPAY trên URL');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold">DNA Testing Booking</h1>
        <p className="text-blue-100">Booking Bloodline DNA Testing</p>
      </div>
      
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Service Information */}
        <div className="lg:col-span-2 space-y-6">
              
          {/* Service Booking Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-600" />
              Service Booking Information
            </h2>
            
            {/* Service Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Service Type *</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => !isServicePreSelected && setSelectedServiceType('legal')}
                  disabled={isServicePreSelected}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedServiceType === 'legal' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  } ${
                    isServicePreSelected 
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-500 hover:text-white cursor-pointer'
                  }`}
                >
                  Legal DNA Testing
                  {isServicePreSelected && selectedServiceType === 'legal' && (
                    <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded">Đã chọn</span>
                  )}
                </button>
                <button
                  onClick={() => !isServicePreSelected && setSelectedServiceType('non-legal')}
                  disabled={isServicePreSelected}
                  className={`px-4 py-2 rounded-md transition-all ${
                    selectedServiceType === 'non-legal' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  } ${
                    isServicePreSelected 
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-500 hover:text-white cursor-pointer'
                  }`}
                >
                  Non-Legal DNA Testing
                  {isServicePreSelected && selectedServiceType === 'non-legal' && (
                    <span className="ml-2 text-xs bg-blue-800 px-2 py-1 rounded">Đã chọn</span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Service Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Service *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentServicesData.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => !isServicePreSelected && setSelectedService(service)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    } ${
                      isServicePreSelected && selectedService?.id !== service.id
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-blue-600">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.processingTime}</p>
                        <p className="text-sm font-semibold text-blue-700">
                          {Number(service.basePrice).toLocaleString()} đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Thông báo đặc biệt cho các dịch vụ */}
            {selectedService?.name === 'DNA Testing for Birth Certificate' && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
                <div className="flex items-start">
                  <InfoCircleOutlined className="text-blue-600 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-blue-700 font-medium">DNA testing for birth registration</p>
                    <p className="text-xs text-blue-600 mt-1">
                    This service only allows to choose one of two relationship pairs: Father - Child or Mother - Child
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Express Service Checkbox */}
            <div className="mb-4">
              <div className={`flex items-center p-4 border rounded-lg ${
                isStandardPreSelected 
                  ? 'border-orange-200 bg-orange-50' 
                  : 'border-orange-200 bg-orange-50'
              }`}>
                <input
                  type="checkbox"
                  id="expressService"
                  checked={isExpressService}
                  onChange={(e) => handleExpressServiceChange(e.target.checked)}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="expressService" className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium flex items-center text-orange-700">
                        <FaClock className="mr-2" />
                        Express Service
                      </span>
                      <p className="text-sm mt-1 text-orange-600">
                       Fast and high priority processing - Results in the shortest time
                      </p>
                      <p className="text-sm font-semibold mt-1 text-orange-600">
                       Additional fees: {selectedService?.expressPrice ? `${selectedService.expressPrice.toLocaleString()} đ` : '1,500,000 đ'}
                      </p>
                    </div>
                    {isExpressPreSelected && isExpressService && (
                      <div className="flex items-center text-orange-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium">Đã chọn</span>
                      </div>
                    )}
                    {isStandardPreSelected && (
                      <div className="flex items-center text-orange-400">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
                        </svg>
                        
                      </div>
                    )}
                  </div>
                </label>
              </div>
              
             
            </div>
            
            {/* Collection Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Collection Method *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    // Prevent selection if it's NIPT service
                    if (selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)') {
                      message.info('NIPT service can only be performed at medical facilities.');
                      return;
                    }
                    
                    setSelectedCollectionMethod({name: 'At Home', price: 0});
                    // Nếu đang là At Facility thì chuyển sang At Home, nếu medication method không hợp lệ thì set lại
                    if (selectedMedicationMethod === 'walk-in' || selectedMedicationMethod === 'express') {
                      setSelectedMedicationMethod('staff-collection');
                    }
                    // Reset timeSlot, appointmentDate khi chuyển collection method
                    setTimeSlot('');
                    setAppointmentDate('');
                    form.setFieldsValue({ timeSlot: undefined, appointmentDate: undefined });
                  }}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedCollectionMethod?.name === 'At Home'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)'
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <FaUser className="text-blue-600 mr-2" />
                    <span className="font-medium">At Home</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Sample collection at your home</p>

                  {selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)' && (
                    <p className="text-xs text-red-500 mt-1">
                      Not available for NIPT service
                    </p>
                  )}
                </div>
                
                <div
                  onClick={() => {
                    setSelectedCollectionMethod({name: 'At Facility', price: 0});
                    setSelectedMedicationMethod('walk-in');
                    // Reset timeSlot, appointmentDate khi chuyển collection method
                    setTimeSlot('');
                    setAppointmentDate('');
                    form.setFieldsValue({ timeSlot: undefined, appointmentDate: undefined });
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCollectionMethod?.name === 'At Facility'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-blue-600 mr-2" />
                    <span className="font-medium">At Facility</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Visit our facility for sample collection</p>

                </div>
              </div>
              
              {/* Address Information - hiển thị bên dưới Collection Method */}
              {selectedCollectionMethod?.name === 'At Home' && (
                <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-start mb-3">
                    <FaMapMarkerAlt className="text-blue-600 mr-2 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-blue-700 mb-2">Địa chỉ nhà *</label>
                      <p className="text-sm text-blue-600 mb-3">Please provide your exact home address.</p>
                    </div>
                  </div>
                  <textarea
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Enter full address (house number, street name, ward/commune, district/county, province/city)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    required
                  />
                </div>
              )}
              
              {selectedCollectionMethod?.name === 'At Facility' && (
                <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-green-600 mr-2 mt-1" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-green-700 mb-2">Facility address</label>
                      <div className="p-3 bg-white border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-700 mb-1">
                          7 D1 Street, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City
                        </p>
                        <p className="text-xs text-green-600">
                         📍 Please come to the above address to collect samples
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Medication Method */}
            {selectedCollectionMethod && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Medication Method *</label>
                <div className="space-y-3">
                  {/* Walk-in - Only for At Facility */}
                  {selectedCollectionMethod?.name === 'At Facility' && (
                    <div
                      onClick={() => !isExpressPreSelected && setSelectedMedicationMethod('walk-in')}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedMedicationMethod === 'walk-in'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${
                        isExpressPreSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center">
                        <FaUser className="text-blue-600 mr-2" />
                        <div>
                          <span className="font-medium">Walk-in</span>
                          <p className="text-sm text-gray-600">Direct visit to facility</p>
                          <p className="text-sm font-semibold text-blue-600">Free</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Staff Collection - Only for At Home */}
                  {selectedCollectionMethod?.name === 'At Home' && (
                    <div
                      onClick={() => setSelectedMedicationMethod('staff-collection')}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedMedicationMethod === 'staff-collection'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <FaUser className="text-blue-600 mr-2" />
                        <div>
                          <span className="font-medium">Staff Collection</span>
                          <p className="text-sm text-gray-600">Professional staff will collect samples</p>
                          {isExpressService ? (
                            <p className="text-sm font-semibold text-green-600">Miễn phí</p>
                          ) : (
                            <p className="text-sm font-semibold text-blue-600">500,000 đ</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Postal Delivery - Hidden when Express Service is selected */}
                  {selectedCollectionMethod?.name === 'At Home' && 
                   selectedServiceType !== 'legal' && 
                   !isExpressService && (
                    <div
                      onClick={() => setSelectedMedicationMethod('postal-delivery')}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedMedicationMethod === 'postal-delivery'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <FaEnvelope className="text-blue-600 mr-2" />
                        <div>
                          <span className="font-medium">Postal Delivery</span>
                          <p className="text-sm text-gray-600">Sample collection kit delivered by post</p>
                          {isExpressService ? (
                            <p className="text-sm font-semibold text-green-600">Miễn phí</p>
                          ) : (
                            <p className="text-sm font-semibold text-blue-600">250,000 đ</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Kit Type Selection */}
            {selectedMedicationMethod && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Kit Type Selection *</label>
                <p className="text-sm text-gray-600 mb-3">
                  📋Select the type of kit that will be used for both test participants.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {kitTypes.map(kit => (
                    <div
                      key={kit.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedKitType === kit.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedKitType(kit.value)}
                    >
                      <div className="font-medium">{kit.label}</div>
                      <p className="text-sm text-gray-600 mb-2">
                        {kit.value === 'K001' 
                          ? 'DNA testing kit with PowerPlex Fusion technology'
                          : 'DNA testing kit with Global Filer technology'
                        }
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        {kit.price === 0 ? 'Free' : `${kit.price.toLocaleString()} đ`}
                      </p>
                      {selectedKitType === kit.value && (
                        <div className="flex items-center text-blue-600 mt-2">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium">Đã chọn</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedKitType && (
                  <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-700 mb-1">
                         Kit selected: {kitTypes.find(k => k.value === selectedKitType)?.label}
                        </p>
                        <p className="text-xs text-blue-600">
                          ✅ This kit will be used for both test participants.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Appointment Schedule - Di chuyển lên đây */}
            <Card 
              title={
                <Space>
                  <CalendarOutlined style={{ color: '#1890ff' }} />
                  <span>Appointment</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              {/* Date Selection */}
              <div className="mb-6">
                <Form.Item
                  name="appointmentDate"
                  label="Appointment date"
                  rules={[{ validator: validateAppointmentDate }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    placeholder="Select appointment date"
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                    value={form.getFieldValue('appointmentDate')}
                    onChange={(date) => {
                      form.setFieldsValue({ appointmentDate: date });
                      setAppointmentDate(date ? date.format('YYYY-MM-DD') : '');
                      // Reset time slot when date changes
                      form.setFieldsValue({ timeSlot: undefined });
                      setTimeSlot('');
                    }}
                  />
                </Form.Item>
              </div>

              {/* Time Selection - Only show when date is selected AND not postal delivery */}
              {appointmentDate && selectedMedicationMethod !== 'postal-delivery' && (
                <div>
                  <Form.Item
                    name="timeSlot"
                    label="Time frame"
                    rules={[{ required: true, message: 'Please select a time slot!' }]}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map(time => {
                        const isDisabled = isTimeSlotDisabled(time);
                        return (
                          <div
                            key={time}
                            className={`
                              p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center flex items-center justify-center
                              ${
                                timeSlot === time
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : isDisabled
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              }
                            `}
                            onClick={() => {
                              if (!isDisabled) {
                                setTimeSlot(time);
                                form.setFieldsValue({ timeSlot: time });
                              }
                            }}
                          >
                            <span className="w-full text-base font-medium flex justify-center items-center">{time}</span>
                            {isDisabled && (
                              <div className="text-xs mt-1 ml-2">Đã qua</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Form.Item>
                  
                  {/* Message when all time slots are disabled */}
                  {areAllTimeSlotsDisabled() && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <ClockCircleOutlined className="text-yellow-600 mr-2" />
                        <span className="text-yellow-800 font-medium">
                          Tất cả khung giờ hôm nay đã qua. Xin hẹn quay lại vào ngày khác!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Message for postal delivery */}
              {appointmentDate && selectedMedicationMethod === 'postal-delivery' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <MailOutlined className="text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">
                      Với phương thức gửi bưu điện, bạn chỉ cần chọn ngày. Kit sẽ được gửi đến địa chỉ của bạn trong ngày đã chọn.
                    </span>
                  </div>
                </div>
              )}
            </Card>

          </div>



          </div>
          
          {/* Test Subject Information với Antd Form */}
          <Card title={
            <Space>
              <TeamOutlined style={{ color: '#1890ff' }} />
              <span>Test Subject Information</span>
            </Space>
          }>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              📋 Please fill in the information completely and accurately to ensure test results.
            </Text>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleConfirmBooking}
              initialValues={{
                firstPerson: {
                  gender: 'male'
                },
                secondPerson: {
                  gender: 'male'
                }
              }}
            >
              {/* First Person */}
              <Card 
                type="inner" 
                title={
                  <Space>
                    <UserOutlined />
                    <span>First Person (Representative)</span>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <Text type="warning" style={{ display: 'block', marginBottom: 16 }}>
                  ⚠️ The representative must be over 18 years of age and will be responsible for this booking.
                </Text>
                
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'fullName']}
                      label="Họ và tên"
                      rules={[
                        { required: true, message: 'Please enter your full name!' },
                        { min: 2, message: 'First and last name must be at least 2 characters!' }
                      ]}
                    >
                      <Input placeholder="Enter your first and last name" prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'dateOfBirth']}
                      label="Ngày sinh"
                      rules={[{ validator: validateAge18 }]}
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="Enter date of birth"
                        format="DD/MM/YYYY"
                        disabledDate={(current) => current && current > moment().endOf('day')}
                        onChange={(date) => {
                                                     // Xử lý sự kiện onChange của DatePicker
                           if (date) {
                             console.log('Date object:', date);
                             console.log('Is moment object:', moment.isMoment(date));
                             console.log('Formatted date:', date.format('DD/MM/YYYY'));
                             console.log('Age calculation:', moment().diff(date, 'years'));
                           }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'gender']}
                      label="Giới tính"
                      rules={[{ required: true, message: 'Please select gender!' }]}
                    >
                      <Radio.Group
                        onChange={() => {
                          // Trigger validation cho relationship khi thay đổi giới tính
                          setTimeout(() => {
                            form.validateFields([['firstPerson', 'relationship']]);
                          }, 0);
                        }}
                      >
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'phoneNumber']}
                      label="Phone number"
                      rules={[{ validator: validatePhoneNumber }]}
                    >
                      <Input placeholder="0123456789 or +84123456789" prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'email']}
                      label="Email"
                      rules={[
                        { required: true, message: 'Please enter email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input placeholder="Enter email address" prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'relationship']}
                      label="Mối quan hệ"
                      rules={[

                        { validator: validateGenderRelationship }
                      ]}
                      dependencies={[['firstPerson', 'gender']]}
                    >
                      <Select 
                        placeholder="Chọn mối quan hệ"
                        onChange={(value) => {
                          // Trigger validation và cập nhật available relationships cho second person
                          form.validateFields([['firstPerson', 'relationship'], ['secondPerson', 'relationship']]);
                          
                          // Cập nhật available relationships cho second person
                          if (selectedService?.name && value) {
                            const validSecondRelationships = getValidRelationshipsForSecondPerson(
                              selectedService.name, 
                              value
                            );
                            setAvailableSecondPersonRelationships(validSecondRelationships.length > 0 
                              ? validSecondRelationships 
                              : availableRelationships
                            );
                            
                            // Reset second person relationship nếu không còn hợp lệ
                            const currentSecondRelationship = form.getFieldValue(['secondPerson', 'relationship']);
                            if (currentSecondRelationship && !validSecondRelationships.includes(currentSecondRelationship)) {
                              form.setFieldsValue({
                                secondPerson: {
                                  ...form.getFieldValue('secondPerson'),
                                  relationship: undefined
                                }
                              });
                            }
                          }
                        }}
                      >
                        {availableRelationships.map(rel => (
                          <Option key={rel} value={rel}>{rel} - {relationshipVietnameseNames[rel]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'sampleType']}
                      label="Loại mẫu"
                      rules={[{ required: true, message: 'Vui lòng chọn loại mẫu!' }]}
                    >
                      <Select placeholder="Chọn loại mẫu">
                        {sampleTypes.map(type => (
                          <Option key={type} value={type}>{type}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['firstPerson', 'personalId']}
                      label="Số CCCD/CMND"
                      rules={[{ validator: validatePersonalId }]}
                    >
                      <Input placeholder="Nhập số CCCD/CMND" prefix={<IdcardOutlined />} />
                    </Form.Item>
                  </Col>
                  

                </Row>
              </Card>
              
              {/* Second Person */}
              <Card 
                type="inner" 
                title={
                  <Space>
                    <UserOutlined />
                    <span>Second Person</span>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'fullName']}
                      label="Họ và tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                      ]}
                    >
                      <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'dateOfBirth']}
                      label="Ngày sinh"
                      rules={[{ validator: validateSecondPersonAge }]}
                      dependencies={[['secondPerson', 'relationship']]}
                    >
                      <DatePicker 
                        style={{ width: '100%' }}
                        placeholder="Chọn ngày sinh"
                        format="DD/MM/YYYY"
                        disabledDate={(current) => current && current > moment().endOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'gender']}
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                      <Radio.Group
                        onChange={() => {
                          // Trigger validation cho relationship khi thay đổi giới tính
                          setTimeout(() => {
                            form.validateFields([['secondPerson', 'relationship']]);
                          }, 0);
                        }}
                      >
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'relationship']}
                      label="Mối quan hệ"
                      rules={[
                        { validator: validateSecondPersonGenderRelationship }
                      ]}
                      dependencies={[['firstPerson', 'relationship'], ['secondPerson', 'gender']]}
                    >
                      <Select 
                        placeholder="Chọn mối quan hệ"
                        onChange={() => {
                          // Trigger validation cho second person khi thay đổi
                          form.validateFields([
                            ['secondPerson', 'relationship'],
                            ['secondPerson', 'dateOfBirth'] // Thêm validation cho dateOfBirth khi relationship thay đổi
                          ]);
                        }}
                      >
                        {availableSecondPersonRelationships.map(rel => (
                          <Option key={rel} value={rel}>{rel} - {relationshipVietnameseNames[rel]}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['secondPerson', 'sampleType']}
                      label="Loại mẫu"
                      rules={[{ required: true, message: 'Vui lòng chọn loại mẫu!' }]}
                    >
                      {selectedService?.name === 'Non-Invasive Relationship Testing (NIPT)' && 
                       form.getFieldValue(['secondPerson', 'relationship']) === 'Child' ? (
                        <Input 
                          value="Amniotic Fluid" 
                          disabled 
                          suffix={
                            <Tooltip title="Mẫu nước ối được sử dụng tự động cho xét nghiệm NIPT">
                              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                          }
                        />
                      ) : (
                        <Select placeholder="Chọn loại mẫu">
                          {sampleTypes.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  

                </Row>
              </Card>
              

              
            </Form>
          </Card>
        </div>
        
        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-blue-600" />
              Booking Summary
            </h2>
            
            {/* Service Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium">
                  {selectedServiceType === 'legal' ? 'Legal' : 'Non-Legal'}
                </span>
              </div>
              
              {selectedService && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-right">{selectedService.name}</span>
                </div>
              )}
              
              {selectedCollectionMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection:</span>
                  <span className="font-medium">{selectedCollectionMethod.name}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Medication:</span>
                <span className="font-medium capitalize">
                  {selectedMedicationMethod.replace('-', ' ')}
                </span>
              </div>
              
              {/* Thêm hiển thị Kit Type */}
              {selectedKitType && (() => {
                const kit = kitTypes.find(k => k.value === selectedKitType);
                return kit ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kit Type:</span>
                    <span className="font-medium text-right">{kit.label}</span>
                  </div>
                ) : null;
              })()}
              
              {appointmentDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium flex-1 text-right truncate">{appointmentDate}</span>
                </div>
              )}
              
              {timeSlot && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium flex-1 text-right truncate">{timeSlot}</span>
                </div>
              )}
            </div>
            
            {/* Cost Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-medium mb-2">Cost Breakdown:</h3>
              
              {selectedService && (
                <div className="flex justify-between text-sm">
                  <span>Service Fee:</span>
                  <span>{selectedService.basePrice?.toLocaleString()} đ</span>
                </div>
              )}
              
              {selectedCollectionMethod && selectedCollectionMethod.price > 0 && !isExpressService && (
                <div className="flex justify-between text-sm">
                  <span>Collection Fee:</span>
                  <span>{selectedCollectionMethod.price.toLocaleString()} đ</span>
                </div>
              )}
              
              {selectedMedicationMethod === 'staff-collection' && (
                <div className="flex justify-between text-sm font-medium text-green-600 bg-green-50 p-2 rounded-md">
                  <span>Phí thu mẫu tại nhà (Staff Collection):</span>
                  <span>{isExpressService ? '0 đồng (Miễn phí)' : '500,000 đ'}</span>
                </div>
              )}
              
              {selectedMedicationMethod === 'postal-delivery' && (
                <div className="flex justify-between text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded-md">
                  <span>Phí gửi bưu điện (Postal Delivery):</span>
                  <span>{isExpressService ? '0 đồng (Miễn phí)' : '250,000 đ'}</span>
                </div>
              )}
              
              {selectedMedicationMethod === 'express' && (
                <div className="flex justify-between text-sm font-medium text-orange-600 bg-orange-50 p-2 rounded-md">
                  <span>Phí dịch vụ express (Express Service):</span>
                  <span>{isExpressService ? '0 đồng (Miễn phí)' : '700,000 đ'}</span>
                </div>
              )}
              
              {isExpressService && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Express Service:</span>
                  <span>
                    {selectedService?.expressPrice ? 
                      `${selectedService.expressPrice.toLocaleString()} đ` : 
                      '1,500,000 đ'
                    }
                  </span>
                </div>
              )}
              
              {/* Thông báo về miễn phí khi chọn Express Service */}
              {isExpressService && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md mt-2 italic text-center">
                  💡 Khi sử dụng Express Service, tất cả các phương thức thu mẫu và vận chuyển đều được miễn phí (0 đồng)
                </div>
              )}
              
              {selectedKitType && (() => {
                const kit = kitTypes.find(k => k.value === selectedKitType);
                return kit && kit.price > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span>Kit Fee:</span>
                    <span>{kit.price.toLocaleString()} đ</span>
                  </div>
                ) : null;
              })()}
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">{calculateTotalCost().toLocaleString()} đ</span>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="mt-4 pt-4 border-t">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <FaCreditCard className="mr-2 text-green-600" />
                  Cash Payment
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <FaQrcode className="mr-2 text-blue-600" />
                  VNPAY
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t">
              {/* Removed debug logs and unnecessary comments for clarity and maintainability */}
              <Button 
                type="primary" 
                htmlType="submit"
                loading={isSubmitting}
                className="w-full h-12 text-lg font-semibold"
                onClick={() => form.submit()}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmBookingModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        bookingData={bookingData}
        onConfirm={handleBookingComplete}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default BookingPage;