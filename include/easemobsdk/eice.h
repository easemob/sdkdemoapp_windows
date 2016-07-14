

#ifndef PJNATH_INCLUDE_EICE_H_
#define PJNATH_INCLUDE_EICE_H_

#ifdef __cplusplus
extern "C"{
#endif

typedef struct eice_st* eice_t;
typedef void (*eice_on_nego_result_t)(eice_t obj, void * cbContext,
		const char * nego_result, int nego_result_len);
typedef void eice_log_func(int level, const char *data, int len);

int eice_init();
void eice_exit();

int eice_new_caller(const char* config, char * local_content, int * p_local_content_len,
		eice_t * pobj);

int eice_new_callee(const char* config, const char * remote_content, int remote_content_len,
		char * local_content, int * p_local_content_len,
		eice_t * pobj);

int eice_caller_nego(eice_t obj, const char * remote_content, int remote_content_len,
		eice_on_nego_result_t cb, void * cbContext );

//int eice_callee_nego(eice_t obj);

int eice_get_nego_result(eice_t obj, char * nego_result, int * p_nego_result_len);

void eice_free(eice_t obj);

void eice_set_log_func(eice_log_func * log_func);


int eice_test();


//int eice_get_local(eice_t obj, char * buf, int * p_buf_len);
//int eice_start_nego(eice_t obj, const char * remote_content, int remote_content_len);
//int eice_wait_nego(eice_t obj, char * buf, int * p_buf_len);




#ifdef __cplusplus
}
#endif

#endif /* PJNATH_INCLUDE_EICE_H_ */
