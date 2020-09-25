import { Class } from './types';
export declare type PropertyAndMethodDecorators = {
    property?: {
        [key: string]: PropertyDecorator[];
    };
    method?: {
        [key: string]: MethodDecorator[];
    };
};
declare type Decorators = {
    class?: ClassDecorator[];
    static?: PropertyAndMethodDecorators;
    instance?: PropertyAndMethodDecorators;
};
export declare const decorators: Map<Class, Decorators>;
export declare const decorate: <T extends PropertyDecorator | MethodDecorator | ClassDecorator>(decorator: T) => T;
export {};
