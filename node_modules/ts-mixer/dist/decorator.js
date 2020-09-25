"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = exports.decorators = void 0;
exports.decorators = new Map();
const getDecoratorsForClass = (clazz) => {
    let decoratorsForClass = exports.decorators.get(clazz);
    if (!decoratorsForClass) {
        decoratorsForClass = {};
        exports.decorators.set(clazz, decoratorsForClass);
    }
    return decoratorsForClass;
};
const decorateClass = (decorator) => ((clazz) => {
    const decoratorsForClass = getDecoratorsForClass(clazz);
    let classDecorators = decoratorsForClass.class;
    if (!classDecorators) {
        classDecorators = [];
        decoratorsForClass.class = classDecorators;
    }
    classDecorators.push(decorator);
    return decorator(clazz);
});
const decorateMember = (decorator) => ((object, key, ...otherArgs) => {
    const decoratorTargetType = typeof object === 'function' ? 'static' : 'instance';
    const decoratorType = typeof object[key] === 'function' ? 'method' : 'property';
    const clazz = decoratorTargetType === 'static' ? object : object.constructor;
    const decoratorsForClass = getDecoratorsForClass(clazz);
    let decoratorsForTargetType = decoratorsForClass === null || decoratorsForClass === void 0 ? void 0 : decoratorsForClass[decoratorTargetType];
    if (!decoratorsForTargetType) {
        decoratorsForTargetType = {};
        decoratorsForClass[decoratorTargetType] = decoratorsForTargetType;
    }
    let decoratorsForType = decoratorsForTargetType === null || decoratorsForTargetType === void 0 ? void 0 : decoratorsForTargetType[decoratorType];
    if (!decoratorsForType) {
        decoratorsForType = {};
        decoratorsForTargetType[decoratorType] = decoratorsForType;
    }
    let decoratorsForKey = decoratorsForType === null || decoratorsForType === void 0 ? void 0 : decoratorsForType[key];
    if (!decoratorsForKey) {
        decoratorsForKey = [];
        decoratorsForType[key] = decoratorsForKey;
    }
    decoratorsForKey.push(decorator);
    // @ts-ignore
    return decorator(object, key, ...otherArgs);
});
exports.decorate = (decorator) => ((...args) => {
    if (args.length === 1)
        return decorateClass(decorator)(args[0]);
    return decorateMember(decorator)(...args);
});
