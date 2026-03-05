import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// الاتصال بقاعدة البيانات
const MONGO_URI = 'mongodb+srv://mhndb:1612@cluster0.cp42syx.mongodb.net/SolyTrading?appName=Cluster0';

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// مخطط الموظف
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['مدير', 'مشرف', 'عامل'],
        required: true
    }
}, {
    timestamps: true
});

// مخطط المستخدم
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب'],
        trim: true,
        maxlength: [50, 'الاسم لا يمكن أن يتجاوز 50 حرف']
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'الرجاء إدخال بريد إلكتروني صحيح'
        ]
    },
    password: {
        type: String,
        required: [true, 'كلمة المرور مطلوبة'],
        minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
        select: false
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'manager', 'employee', 'viewer'],
            message: 'الدور يجب أن يكون admin أو manager أو employee أو viewer'
        },
        default: 'admin'
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'يجب ربط المستخدم بموظف'] // هذا هو الخطأ
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);
const User = mongoose.model('User', userSchema);

// إنشاء المستخدم التجريبي
const createTestUser = async () => {
  try {
    console.log('🔍 Checking if user exists...');
    
    // التحقق من وجود المستخدم مسبقاً
    const existingUser = await User.findOne({ email: 'admin@soly.com' });
    if (existingUser) {
      console.log('⚠️ User already exists:', existingUser.email);
      console.log('🗑️ Deleting existing user...');
      await User.deleteOne({ email: 'admin@soly.com' });
      console.log('✅ Old user deleted');
    }

    // التحقق من وجود موظف مسبقاً
    let employee = await Employee.findOne({ email: 'admin@soly.com' });
    if (!employee) {
      console.log('👤 Creating employee...');
      employee = new Employee({
        name: 'مدير النظام',
        position: 'مدير عام',
        role: 'مدير'
      });
      await employee.save();
      console.log('✅ Employee created');
    }

    console.log('🔐 Hashing password...');
    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    console.log('👤 Creating new user...');
    // إنشاء المستخدم
    const user = new User({
      name: 'مدير النظام',
      email: 'admin@soly.com',
      password: hashedPassword,
      role: 'admin',
      employee: employee._id, // ربط المستخدم بالموظف
      isActive: true
    });

    await user.save();
    console.log('🎉 Test user created successfully!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: admin123');
    console.log('🔒 Role:', user.role);
    console.log('👥 Employee ID:', user.employee.toString());
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// تشغيل الدالة بعد الاتصال
setTimeout(() => {
  mongoose.connection.once('connected', createTestUser);
}, 1000);
