//
//  emstl.h
//  easemob
//
//  Created by linan on 16/3/8.
//
//

#ifndef emstl_h
#define emstl_h

#include <assert.h>
#include <map>
#include <mutex>
#include <set>
#include <vector>

namespace easemob
{
//--------------------- provide concurrent safe stl wrapper ---------------------
//    example
//    void testVector() {
//        EMVector<int> v;
//        v.push_back(0);
//        v.push_back(1);
//        v.push_back(2);
//
//        synchronize(v, [&](){
//            int i = 0;
//            for (vector<int>::iterator iter = v.begin(); iter != v.end(); ++iter) {
//                cout << "v[" << i << "]:" << *iter << endl;
//                i++;
//            }
//        });
//
//        cout << "operator v[2]:" << v[2] << endl;
//    }
    
//    notice: not contain vector<bool> wrapper
//    synchronize braces should enclose iterator operations
//    add new method:
//      get: return inner reference, remember enclose it with synchronize braces
//      clone: return a cloned object from inner object
//
//    notice:
//    synchronize function has limitation, following case is a liable use case and misused:
//      synchronize(mMyGroups, [&](){
//          if (mMyGroups.find(msg->conversationId()) != mMyGroups.end())
//          {
//              return true;
//          }
//      });
//    the original purpose is if reach the condition, return.
//    but in synchronize(obj, lamda), lamda return only return from synchronize scope.
//    Please using following code instead:
//      std::lock_guard<std::recursive_mutex> lock(mMyGroups.getMutex());
//    
//    limitation:
//    not fully support initializer_list, cripple in supporting empty braces, such as:
//    EMVector<int> v = {};                                           // not support
//    EMVector<int> v1 = {1};                                         // ok
//    EMMap<int, std::string> m = {};                                 // not support
//    EMMap<std::string, float> m1 = {{"", 10.2f}, {"", 10.0f}};      // ok
    
    typedef std::function<void()> EMProcedure;

    class EMSTLBase {
    public:
        std::recursive_mutex &getMutex() { return mMutex; }
    protected:
        std::recursive_mutex mMutex;
    };

    inline void synchronize(EMSTLBase &obj, EMProcedure procedure) {
        std::lock_guard<std::recursive_mutex> lock(obj.getMutex());
        procedure();
    }

#ifndef _WIN32
#ifndef _LIBCPP_INLINE_VISIBILITY
#define _LIBCPP_INLINE_VISIBILITY __attribute__ ((__visibility__("hidden"), __always_inline__))
#endif
#else
#define _LIBCPP_INLINE_VISIBILITY
#endif

    // this macro help evade dead lock
#define _lock_both(obj0, obj1)                                                              \
        assert(&obj0 != &obj1);                                                             \
        std::unique_lock<std::recursive_mutex> _lock0((obj0).getMutex(), std::defer_lock);  \
        std::unique_lock<std::recursive_mutex> _lock1((obj1).getMutex(), std::defer_lock);  \
        if (&(obj0) < &(obj1)) {                                                            \
            _lock0.lock();                                                                  \
            _lock1.lock();                                                                  \
        } else {                                                                            \
            _lock1.lock();                                                                  \
            _lock0.lock();                                                                  \
        }

    
    template <typename T >
    class EMVector : public EMSTLBase {
    public:
        typedef typename std::vector<T>::iterator iterator;
        typedef typename std::vector<T>::const_iterator const_iterator;
        typedef typename std::vector<T>::reverse_iterator reverse_iterator;
        typedef typename std::vector<T>::const_reverse_iterator const_reverse_iterator;
        typedef typename std::vector<T>::size_type size_type;
        typedef typename std::vector<T>::allocator_type allocator_type;
        typedef typename std::vector<T>::value_type value_type;
        typedef T & reference;
        typedef const T & const_reference;
        
        explicit EMVector (const allocator_type& alloc = allocator_type()) {
            std::vector<T> v = std::vector<T>(alloc);
            _vector = v;
        }
        
        explicit EMVector (size_type n, const value_type& val = value_type(),
                           const allocator_type& alloc = allocator_type()) {
            std::vector<T> v = std::vector<T>(n, val, alloc);
            _vector = v;
        }
        
        template <class InputIterator>
        EMVector (InputIterator first, InputIterator last,
                  const allocator_type& alloc = allocator_type()) {
            std::vector<T> v = std::vector<T>(first, last, alloc);
            _vector = v;
        }
        
        virtual ~EMVector() {
        }
        
        EMVector(const std::vector<T> &v) {
            _vector = v;
        }

        EMVector(const EMVector<T> &v) {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMVector<T>&>(v).getMutex());
            _vector = v.get();
        }
        
#ifndef _LIBCPP_HAS_NO_RVALUE_REFERENCES
        EMVector(std::vector<T> &&v) {
            _vector = std::move(v);
        }
        
        EMVector(EMVector<T> &&v) {
            std::lock_guard<std::recursive_mutex> lock(v.getMutex());
            _vector.swap(v._vector);
            v._vector.clear();
        }
#endif  // _LIBCPP_HAS_NO_RVALUE_REFERENCES
        
        inline EMVector & operator=(const EMVector<T> &v) {
            if (this == &v) {
                return *this;
            }
            EMVector<T> *_v = const_cast<EMVector<T>*>(&v);
            _lock_both(*this, *_v);
            _vector = v.get();
            return *this;
        }
        
        inline EMVector & operator=(const std::vector<T> &v) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            if (&_vector != &v) {
                _vector = v;
            }
            return *this;
        }

#ifndef _LIBCPP_HAS_NO_RVALUE_REFERENCES
        inline EMVector & operator=(EMVector<T> &&v) {
            _lock_both(*this, v);
            _vector = std::move(v.get());
            return *this;
        }

        inline EMVector & operator=(std::vector<T> &&v) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector = std::move(v);
            return *this;
        }
#endif  // _LIBCPP_HAS_NO_RVALUE_REFERENCES
        
        inline const std::vector<T> & get() const {
            return _vector;
        }
        
        inline std::vector<T> clone() const {
            EMVector<T> *temp = const_cast<EMVector<T>*>(this);
            std::lock_guard<std::recursive_mutex> lock(temp->getMutex());
            return _vector;
        }
        
#ifndef _LIBCPP_HAS_NO_GENERALIZED_INITIALIZERS
        _LIBCPP_INLINE_VISIBILITY
        EMVector(std::initializer_list<value_type> __il) {
            _vector = __il;
        }
        _LIBCPP_INLINE_VISIBILITY
        EMVector(std::initializer_list<value_type> __il, const allocator_type& __a) {
            _vector = std::vector<value_type>(__il, __a);
        }
        _LIBCPP_INLINE_VISIBILITY
        inline EMVector & operator=(std::initializer_list<value_type> &&__il) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector = std::vector<value_type>(std::forward(__il));
            return *this;
        }
#endif  // _LIBCPP_HAS_NO_GENERALIZED_INITIALIZERS

        //--------------------- modifier ---------------------
        inline const T & operator[](size_type n) const {
            EMVector<T> *temp = const_cast<EMVector<T>*>(this);
            std::lock_guard<std::recursive_mutex> lock(temp->getMutex());
            return _vector[n];
        }
        
        inline void assign(iterator first, iterator last) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.assign(first, last);
        }
        
        inline void assign(size_type n, const T &val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.assign(n, val);
        }
        
        inline void push_back(const T &val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.push_back(val);
        }
        
        inline void pop_back(const T &val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.pop_back(val);
        }
        
        inline void insert(iterator position, T &val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.insert(position, val);
        }
        
        inline void insert (iterator position, size_type n, const value_type& val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.insert(position, n, val);
        }
        
        template <class InputIterator>
        inline void insert (iterator position, InputIterator first, InputIterator last) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.insert(position, first, last);
        }
        
        inline iterator erase(iterator position) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector.erase(position);
        }
        
        inline iterator erase (iterator first, iterator last) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector.erase(first, last);
        }
        
        inline void swap(std::vector<T>& x) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.swap(x);
        }
        
        inline void swap(EMVector<T>& x) {
            _lock_both(*this, x);
            _vector.swap(x);
        }
        
        inline void clear() {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.clear();
        }

        //--------------------- Capacity ---------------------
        inline size_type size() const {
            return _vector.size();
        }
        
        inline size_type max_size() const {
            return _vector.max_size();
        }
        
        inline void resize (size_type n, value_type val = value_type()) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector.resize(n, val);
        }
        
        inline size_type capacity() const {
            return _vector.capacity();
        }
        
        inline bool empty() const {
            return _vector.empty();
        }
        
        inline void reserve (size_type n) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.reserve(n);
        }
        
        inline void shrink_to_fit() {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _vector.shrink_to_fit();
        }
        
        //--------------------- Element access ---------------------
        inline T & operator[](size_type n) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector[n];
        }
        
        inline reference at (size_type n) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector[n];
        }
        
        inline const_reference at (size_type n) const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector[n];
        }
        
        inline reference front() {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector.front();
        }
        
        inline const_reference front() const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector.front();
        }
        
        inline reference back() {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector.back();
        }
        
        inline const_reference back() const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _vector.back();
        }
        
        // not thread safe, deprecated
//        value_type* data() ;
//        const value_type* data() const ;
        
        //--------------------- Iterator ---------------------
        inline iterator begin() {
            return _vector.begin();
        }
        
        inline const_iterator begin() const {
            return _vector.begin();
        }
        inline iterator end() {
            return _vector.end();
        }
        
        inline const_iterator end() const {
            return _vector.end();
        }
        
        inline reverse_iterator rbegin() {
            return _vector.rbegin();
        }
        
        inline const_reverse_iterator rbegin() const {
            return _vector.rbegin();
        }
        
        inline reverse_iterator rend() {
            return _vector.rend();
        }
        
        inline const_reverse_iterator rend() const {
            return _vector.rend();
        }
        
        inline const_iterator cbegin() const  {
            return _vector.cbegin();
        }
        
        inline const_iterator cend() const  {
            return _vector.cend();
        }
        
        inline const_reverse_iterator crbegin() const  {
            return _vector.crbegin();
        }
        
        inline const_reverse_iterator crend() const  {
            return _vector.crend();
        }
        
    private:
        std::vector<T> _vector;
    };
    
    template <class _Key, class _Tp, class _Compare = std::less<_Key>,
    class _Allocator = std::allocator<std::pair<const _Key, _Tp> > >
    class EMMap : public EMSTLBase {
    public:
        typedef _Key                                                key_type;
        typedef _Tp                                                 mapped_type;
        typedef typename std::map<_Key, _Tp>::iterator              iterator;
        typedef typename std::map<_Key, _Tp>::const_iterator        const_iterator;
        typedef typename std::map<_Key, _Tp>::reverse_iterator      reverse_iterator;
        typedef typename std::map<_Key, _Tp>::const_reverse_iterator      const_reverse_iterator;
        typedef typename std::map<_Key, _Tp>::size_type             size_type;
        typedef typename std::pair<const _Key, _Tp>                 value_type;
        typedef typename std::map<_Key, _Tp>::key_compare           key_compare;
        typedef typename std::map<_Key, _Tp>::allocator_type        allocator_type;
        
        explicit EMMap (const key_compare& comp = key_compare(),
                        const allocator_type& alloc = allocator_type()) {
            std::map<_Key, _Tp> m = std::map<_Key, _Tp>(comp, alloc);
            _map = m;
        }
        
        template <class InputIterator>
        EMMap (InputIterator first, InputIterator last,
               const key_compare& comp = key_compare(),
               const allocator_type& alloc = allocator_type()) {
            std::map<_Key, _Tp> m = std::map<_Key, _Tp>(first, last, comp, alloc);
            _map = m;
        }
        
        inline EMMap(const std::map<_Key, _Tp> &v_) {
            _map = v_;
        }
        
        virtual ~EMMap() {
        }
        
        EMMap(const EMMap<key_type, mapped_type> &v) {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMMap<key_type, mapped_type>&>(v).getMutex());
            _map = v.get();
        }
        
        inline EMMap & operator=(const EMMap<key_type, mapped_type> &v) {
            if (this == &v) {
                return *this;
            }
            EMMap<key_type, mapped_type> *_v = const_cast<EMMap<key_type, mapped_type>*>(&v);
            _lock_both(*this, *_v);
            _map = v.get();
            return *this;
        }
        
        inline EMMap & operator=(const std::map<key_type, mapped_type> &v) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            if (&_map != &v) {
                _map = v;
            }
            return *this;
        }
        
#ifndef _LIBCPP_HAS_NO_RVALUE_REFERENCES
        EMMap(std::map<key_type, mapped_type> &&v) {
            _map = std::move(v);
        }
        
        EMMap(EMMap<key_type, mapped_type> &&v) {
            std::lock_guard<std::recursive_mutex> lock(v.getMutex());
            std::swap(_map, v._map);
            v._map.clear();
        }
        
        inline EMMap & operator=(EMMap<key_type, mapped_type> &&v) {
            _lock_both(*this, v);
            std::swap(_map, v._map);
            v._map.clear();
            return *this;
        }
        
        inline EMMap & operator=(std::map<key_type, mapped_type> &&v) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _map = std::move(v);
            return *this;
        }
#endif  // _LIBCPP_HAS_NO_RVALUE_REFERENCES
        
        inline const std::map<_Key, _Tp> & get() const {
            return _map;
        }
        
        inline std::map<_Key, _Tp> clone() const {
            EMMap<key_type, mapped_type> *temp = const_cast<EMMap<key_type, mapped_type> *>(this);
            std::lock_guard<std::recursive_mutex> lock(temp->getMutex());
            return _map;
        }
        
#ifndef _LIBCPP_HAS_NO_GENERALIZED_INITIALIZERS
        _LIBCPP_INLINE_VISIBILITY
        EMMap(std::initializer_list<value_type> __il, const key_compare& __comp = key_compare())
        {
            _map = std::map<_Key, _Tp>(__comp);
            _map.insert(__il.begin(), __il.end());
        }
        
        _LIBCPP_INLINE_VISIBILITY
        EMMap(std::initializer_list<value_type> __il, const key_compare& __comp, const allocator_type& __a)
        {
            _map = std::map<_Key, _Tp>(__comp);
            _map.insert(__il.begin(), __il.end());
        }
        
#if _LIBCPP_STD_VER > 11
        _LIBCPP_INLINE_VISIBILITY
        EMMap(std::initializer_list<value_type> __il, const allocator_type& __a)
        : _map(__il, key_compare(), __a) {}
#endif
        
        _LIBCPP_INLINE_VISIBILITY
        inline EMMap& operator=(std::initializer_list<value_type> __il)
        {
            _map.insert(__il.begin(), __il.end());
            return *this;
        }
#endif  // _LIBCPP_HAS_NO_GENERALIZED_INITIALIZERS
        
        //--------------------- modifier ---------------------

        inline std::pair<iterator,bool> insert (const value_type& val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.insert(val);
        }
        
        inline iterator insert (iterator position, const value_type& val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.insert(position, val);
        }
        
        inline void insert(const_iterator first, const_iterator last) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.insert(first, last);
        }
        
        // erase return type, http://cplusplush.com/map/map/erase/ definition is mismatched with gnustl/xcode code
        inline iterator erase (iterator position) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.erase(position);
        }
        
        inline size_type erase(const key_type& k) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.erase(k);
        }
        
        inline iterator erase(iterator first, iterator last) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.erase(first, last);
        }
        
        inline void swap (std::map<_Key, _Tp>& x) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _map.swap(x);
        }

        inline void swap (EMMap<_Key, _Tp>& x) {
            _lock_both(*this, x);
            _map.swap(x.get());
        }

        inline void clear() {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _map.clear();
        }
        
        //        emplace
        //        Construct and insert element (public member function )
        //        emplace_hint
        //        Construct and insert element with hint (public member function )
        
        //--------------------- Iterator ---------------------
        inline iterator begin() {
            return _map.begin();
        }
        
        inline const_iterator begin() const {
            return _map.begin();
        }
        
        inline iterator end() {
            return _map.end();
        }
        
        inline const_iterator end() const {
            return _map.end();
        }
        
        inline reverse_iterator rbegin() {
            return _map.rbegin();
        }
        
        inline const_reverse_iterator rbegin() const {
            return _map.rbegin();
        }
        
        inline reverse_iterator rend() {
            return _map.rend();
        }
        
        inline const_reverse_iterator rend() const {
            return _map.rend();
        }
        
        inline const_iterator cbegin() const  {
            return _map.cbegin();
        }
        
        inline const_iterator cend() const  {
            return _map.cend();
        }
        
        inline const_reverse_iterator crbegin() const  {
            return _map.crbegin();
        }
        
        inline const_reverse_iterator crend() const  {
            return _map.crend();
        }

        //--------------------- Capacity ---------------------
        inline bool empty() const {
            return _map.empty();
        }
        
        inline size_type size() const {
            return _map.size();
        }
        
        inline size_type max_size() const {
            return _map.max_size();
        }
        
        //--------------------- Element access ---------------------
        inline _Tp & operator[](_Key k) {
            return _map[k];
        }
        
        inline mapped_type& at (const key_type& k) {
            return _map[k];
        }
        
        inline const mapped_type& at (const key_type& k) const {
            return _map[k];
        }
        
        //--------------------- Operations ---------------------
        inline iterator find (const key_type& k) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.find(k);
        }
        
        inline const_iterator find (const key_type& k) const {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMMap<key_type, mapped_type>*>(this)->getMutex());
            return _map.find(k);
        }
        
        inline size_type count (const key_type& k) const {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMMap<key_type, mapped_type>*>(this)->getMutex());
            return _map.cout(k);
        }
        
        inline iterator lower_bound (const key_type& k) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.lower_bound(k);
        }
        
        inline const_iterator lower_bound (const key_type& k) const {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMMap<key_type, mapped_type>*>(this)->getMutex());
            return _map.lower_bound(k);
        }
        
        inline iterator upper_bound (const key_type& k) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.upper_bound(k);
        }
        
        inline const_iterator upper_bound (const key_type& k) const {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMMap<key_type, mapped_type>*>(this)->getMutex());
            return _map.upper_bound(k);
        }

        inline std::pair<const_iterator,const_iterator> equal_range (const key_type& k) const {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMMap<key_type, mapped_type>*>(this)->getMutex());
            return _map.equal_range(k);
        }
        
        inline std::pair<iterator,iterator>             equal_range (const key_type& k) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _map.equal_range(k);
        }
        
    private:
        std::map<_Key, _Tp> _map;
    };
    
    
    template <class _Key, class _Compare = std::less<_Key>,
    class _Allocator = std::allocator<_Key> >
    class EMSet : public EMSTLBase {
    public:
        typedef _Key                                                key_type;
        typedef key_type                                            value_type;
        typedef typename std::set<_Key>::iterator                   iterator;
        typedef typename std::set<_Key>::const_iterator             const_iterator;
        typedef typename std::set<_Key>::reverse_iterator           reverse_iterator;
        typedef typename std::set<_Key>::const_reverse_iterator     const_reverse_iterator;
        typedef _Compare                                            key_compare;
        typedef key_compare                                         value_compare;
        typedef _Allocator                                          allocator_type;
        typedef typename std::set<_Key>::size_type                  size_type;
        
        explicit EMSet (const key_compare& comp = key_compare(),
                        const allocator_type& alloc = allocator_type()) {
            std::set<key_type, key_compare, allocator_type> s = std::set<key_type, key_compare, allocator_type>
            (comp, alloc);
        }
        
        template <class InputIterator>
        EMSet (InputIterator first, InputIterator last,
               const key_compare& comp = key_compare(),
               const allocator_type& alloc = allocator_type()) {
            std::set<key_type, key_compare, allocator_type> s = std::set<key_type, key_compare, allocator_type>
            (first, last, comp, alloc);
        }
        
        inline EMSet & operator=(std::set<key_type> &set) {
            _set = set;
            return *this;
        }
        
        virtual ~EMSet() {
        }
        
        EMSet(const std::set<key_type> &v) {
            _set = v;
        }
        
        EMSet(const EMSet<key_type> &v) {
            std::lock_guard<std::recursive_mutex> lock(const_cast<EMSet<key_type>&>(v).getMutex());
            _set = v.get();
        }
        
        inline EMSet & operator=(const EMSet<key_type> &v) {
            if (this != &v) {
                EMSet<key_type> *_v = const_cast<EMSet<key_type>*>(&v);
                _lock_both(*this, *_v);
                _set = v.get();
            }
            return *this;
        }
        
        inline EMSet & operator=(const std::set<key_type> &v) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            if (&_set != &v) {
                _set = v;
            }
            return *this;
        }
        
        EMSet(std::set<key_type> &v) {
            _set = v;
        }
        
        EMSet(EMSet<key_type> &v) {
            _set = v.get();
        }
        
#ifndef _LIBCPP_HAS_NO_RVALUE_REFERENCES
        EMSet(std::set<key_type> &&v) {
            _set = std::move(v);
        }
        
        EMSet(EMSet<key_type> &&v) {
            std::lock_guard<std::recursive_mutex> lock(v.getMutex());
            std::swap(_set, v._set);
            v._set.clear();
        }
        
        inline EMSet & operator=(EMSet<key_type> &&v) {
            _lock_both(*this, v);
            std::swap(_set, v._set);
            v._vset.clear();
            return *this;
        }
        
        inline EMSet & operator=(std::set<key_type> &&v) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            if (&_set != &v) {
                std::move(_set, v);
            }
            return *this;
        }
#endif  // _LIBCPP_HAS_NO_RVALUE_REFERENCES
        
        inline const std::set<key_type> & get() const {
            return _set;
        }
        
        inline std::set<key_type> clone() const {
            EMSet<key_type> *temp = const_cast<EMSet<key_type> *>(this);
            std::lock_guard<std::recursive_mutex> lock(temp->getMutex());
            return _set;
        }
        
#ifndef _LIBCPP_HAS_NO_GENERALIZED_INITIALIZERS
        _LIBCPP_INLINE_VISIBILITY
        EMSet(std::initializer_list<value_type> __il, const value_compare& __comp = value_compare())
        {
            _set = std::set<key_type>(__comp);
            _set.insert(__il.begin(), __il.end());
        }
        
        _LIBCPP_INLINE_VISIBILITY
        EMSet(std::initializer_list<value_type> __il, const value_compare& __comp,
            const allocator_type& __a)
        {
            _set = std::set<key_type>(__comp, __a);
            _set.insert(__il.begin(), __il.end());
        }
        
#if _LIBCPP_STD_VER > 11
        _LIBCPP_INLINE_VISIBILITY
        EMSet(std::initializer_list<value_type> __il, const allocator_type& __a)
        {
            _set = std::set<key_type>(key_compare(), __a);
            _set.insert(__il.begin(), __il.end());
        }
#endif
        
        _LIBCPP_INLINE_VISIBILITY
        inline EMSet& operator=(std::initializer_list<value_type> __il)
        {
            _set = std::set<key_type>();
            _set.insert(__il.begin(), __il.end());
            return *this;
        }
#endif  // _LIBCPP_HAS_NO_GENERALIZED_INITIALIZERS
        
        //--------------------- Modifiers ---------------------
        inline std::pair<iterator,bool> insert (const value_type& val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.insert(val);
        }
        
        inline iterator insert (iterator position, const value_type& val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.insert(position, val);
        }
        
        template <class InputIterator>
        inline void insert (InputIterator first, InputIterator last) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.insert(first, last);
        }
        
        // erase return type, http://cplusplush.com/map/map/erase/ definition is mismatched with gnustl/xcode code
        inline iterator erase (iterator position) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.erase(position);
        }
        
        inline size_type erase (const value_type& val) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.erase(val);
        }
        
        inline iterator erase (iterator first, iterator last) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.erase(first, last);
        }
        
        inline void swap (std::set<key_type>& x) {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _set.swap(x);
        }
        
        inline void swap (EMSet<key_type>& x) {
            _lock_both(*this, x);
            _set.swap(x);
        }
        
        inline void clear() {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            _set.clear();
        }
        
        //--------------------- Iterators ---------------------
        inline iterator begin() {
            return _set.begin();
        }
        
        inline const_iterator begin() const {
            return _set.begin();
        }
        
        inline iterator end() {
            return _set.end();
        }
        
        inline const_iterator end() const {
            return _set.end();
        }
        
        inline reverse_iterator rbegin() {
            return _set.rbegin();
        }
        
        inline const_reverse_iterator rbegin() const {
            return _set.rbegin();
        }
        
        inline reverse_iterator rend() {
            return _set.rend();
        }
        
        inline const_reverse_iterator rend() const {
            return _set.rend();
        }
        
        inline const_iterator cbegin() const  {
            return _set.cbegin();
        }
        
        inline const_iterator cend() const  {
            return _set.cend();
        }
        
        inline const_reverse_iterator crbegin() const  {
            return _set.crbegin();
        }
        
        inline const_reverse_iterator crend() const  {
            return _set.crend();
        }
        
        //--------------------- Capacity ---------------------
        inline bool empty() const {
            return _set.empty();
        }
        
        inline size_type size() const {
            return _set.size();
        }
        
        inline size_type max_size() const {
            return _set.max_size();
        }
        
        //--------------------- Operations ---------------------
        inline iterator find (const value_type& val) const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.find(val);
        }
        
        inline size_type count (const value_type& val) const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.count(val);
        }
        
        inline iterator lower_bound (const value_type& val) const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.lower_bound(val);
        }
        
        inline iterator upper_bound (const value_type& val) const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.uppper_bound(val);
        }
        
        inline std::pair<iterator,iterator> equal_range (const value_type& val) const {
            std::lock_guard<std::recursive_mutex> lock(getMutex());
            return _set.equal_range(val);
        }
        
    private:
        std::set<_Key> _set;
    };

}

#endif /* emstl_h */
